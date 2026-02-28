import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import { getOtpEmailTemplate } from '../utils/emailTemplates.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_change_me', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user (Step 1: Send OTP)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            if (userExists.isVerified) {
                return res.status(400).json({ message: 'User already exists' });
            }
            // If user exists but not verified, we can resend OTP (and update password/name)
            // Or delete and recreate. Let's update details and resend OTP.
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins

        // Create or Update User (Unverified)
        if (userExists) {
            userExists.name = name;
            userExists.password = hashedPassword;
            userExists.resetPasswordToken = otpHash; // Reuse field for verification OTP
            userExists.resetPasswordExpire = otpExpire;
            await userExists.save();
        } else {
            await User.create({
                name,
                email,
                password: hashedPassword,
                resetPasswordToken: otpHash,
                resetPasswordExpire: otpExpire,
                isVerified: false
            });
        }

        // Send OTP Email
        const message = getOtpEmailTemplate(otp); // Customize template title if needed
        try {
            await sendEmail({
                email: email,
                subject: 'Verify Your Account - CareerCraft',
                message,
                isHtml: true
            });

            console.log(`Signup OTP for ${email}: ${otp}`);
            res.status(200).json({ success: true, message: 'Verification OTP sent to email' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify OTP and Finalize Registration
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken: otpHash,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or expired' });
        }

        // Mark verified and clear token
        user.isVerified = true;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        const token = generateToken(user._id);
        user.activeSessionToken = token;
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
            profilePicture: user.profilePicture || "",
            stats: user.stats
        });

    } catch (error) {
        console.error('Error in verifyOtp:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.isVerified === false) {
                return res.status(401).json({ message: 'Please verify your email first' });
            }

            const token = generateToken(user.id);

            // Set the active session token (replaces any previous session)
            user.activeSessionToken = token;
            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
                profilePicture: user.profilePicture || "",
                stats: user.stats
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // Set expire
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        const message = getOtpEmailTemplate(otp);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP - CareerCraft',
                message, // This should be HTML
                isHtml: true
            });

            console.log(`OTP for ${email}: ${otp}`); // Log OTP for debugging

            res.status(200).json({ success: true, data: 'OTP sent to email' });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or expired' });
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            message: 'Password updated success'
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Auth user with Google (Login or Register)
// @route   POST /api/auth/google
// @access  Public
// @desc    Auth user with Google (Login or Register)
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
    const { name, email, googleId, picture } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            const token = generateToken(user._id);
            // Set the active session token (replaces any previous session)
            user.activeSessionToken = token;
            await user.save();

            // User exists - Login
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        } else {
            // User doesn't exist - Register
            const { name, email, googleId, picture } = req.body;

            // Note: Password is not required in schema for Google users
            user = await User.create({
                name,
                email,
                profilePicture: picture || "", // Save Google profile picture
                isVerified: true, // Google users are already verified
                // We don't set a password for Google users
            });

            if (user) {
                const userToken = generateToken(user._id);
                user.activeSessionToken = userToken;
                await user.save();

                res.status(201).json({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: userToken
                });
            } else {
                res.status(400).json({ message: 'Invalid user data' });
            }
        }
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: 'Server error during Google login' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                stats: user.stats || {
                    interviewsAttended: 0,
                    quizzesTaken: 0,
                    averageScore: 0,
                    resumeScore: 0
                },
                recentActivities: user.recentActivities || [],
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error in getMe:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }
            if (req.body.profilePicture) {
                user.profilePicture = req.body.profilePicture;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePicture: updatedUser.profilePicture,
                stats: updatedUser.stats,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a recent activity
// @route   POST /api/auth/activity
// @access  Private
export const addRecentActivity = async (req, res) => {
    try {
        const { title, activityType, score } = req.body;
        const user = await User.findById(req.user.id);

        if (user) {
            // Add new activity to the beginning of the array
            user.recentActivities.unshift({
                title,
                activityType,
                score,
                timestamp: Date.now()
            });

            // Keep only the last 20 activities
            if (user.recentActivities.length > 20) {
                user.recentActivities = user.recentActivities.slice(0, 20);
            }

            await user.save();
            res.status(201).json(user.recentActivities);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error in addRecentActivity:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Logout user (clear active session)
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.activeSessionToken = null;
            await user.save();
            res.json({ message: 'Logged out successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error in logoutUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
