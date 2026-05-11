import User from '../models/User.js';
import Log from '../models/Log.js';
import Feedback from '../models/Feedback.js';
import Notification from '../models/Notification.js';
import ForumPost from '../models/ForumPost.js';
import sendEmail from '../utils/sendEmail.js';
import { getBroadcastEmailTemplate } from '../utils/emailTemplates.js';

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
    console.log("Admin getStats hit");
    try {
        const totalUsers = await User.countDocuments();
        
        // Calculate active sessions (users active in the last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeSessions = await User.countDocuments({
            lastActive: { $gte: fiveMinutesAgo }
        });

        const pendingReports = await Feedback.countDocuments({ status: 'pending' });
        const totalPosts = await ForumPost.countDocuments();

        res.json({
            stats: [
                { label: "Total Users", value: totalUsers.toString(), change: "+0%", icon: "Users", trend: "neutral" },
                { label: "Active Sessions", value: activeSessions.toString(), change: "0%", icon: "Activity", trend: "neutral" },
                { label: "Pending Feedback", value: pendingReports.toString(), change: "0%", icon: "AlertTriangle", trend: "neutral" },
                { label: "Total Forum Posts", value: totalPosts.toString(), change: "0%", icon: "FileText", trend: "neutral" },
            ]
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password') // Don't send passwords
            .sort({ createdAt: -1 }); // Newest first

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error deleting user' });
    }
};

// @desc    Toggle Suspend User status
// @route   PUT /api/admin/users/:id/toggle-suspend
// @access  Private/Admin
export const toggleSuspendUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isSuspended = !user.isSuspended;
        await user.save();

        // Log action
        await Log.create({
            userId: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            action: 'suspicious_activity',
            details: `${user.isSuspended ? 'Suspended' : 'Unsuspended'} user ${user.email}`
        });

        res.json({ message: `User has been ${user.isSuspended ? 'suspended' : 'activated'}`, isSuspended: user.isSuspended });
    } catch (error) {
        res.status(500).json({ message: 'Server error toggling suspend status' });
    }
};

// @desc    Get all system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
export const getLogs = async (req, res) => {
    try {
        const logs = await Log.find({}).sort({ timestamp: -1 }).limit(200);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching logs' });
    }
};

// @desc    Get all feedbacks
// @route   GET /api/admin/feedback
// @access  Private/Admin
export const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({}).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching feedback' });
    }
};

// @desc    Update feedback (resolve and notify)
// @route   PUT /api/admin/feedback/:id
// @access  Private/Admin
export const resolveFeedback = async (req, res) => {
    try {
        const { status, adminReply } = req.body;
        const feedback = await Feedback.findById(req.params.id);
        
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        feedback.status = status;
        feedback.adminReply = adminReply;
        feedback.updatedAt = Date.now();
        await feedback.save();

        if (status === 'resolved') {
            // Create notification for the user
            await Notification.create({
                user: feedback.userId,
                type: 'feedback_update',
                title: 'Feedback Resolved ✅',
                message: `Your report regarding "${feedback.title}" has been resolved. Admin reply: ${adminReply || 'Resolved'}`,
                isRead: false
            });
        } else if (status === 'in_review') {
            await Notification.create({
                user: feedback.userId,
                type: 'feedback_update',
                title: 'Feedback In Review 🕒',
                message: `Your report regarding "${feedback.title}" is now being reviewed by an administrator.`,
                isRead: false
            });
        }

        res.json({ message: 'Feedback updated successfully', feedback });
    } catch (error) {
        console.error('Error resolving feedback:', error);
        res.status(500).json({ message: 'Server error updating feedback' });
    }
};

// @desc    Get all forum posts for management
// @route   GET /api/admin/forum/posts
// @access  Private/Admin
export const getAdminForumPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find({}).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching forum posts' });
    }
};

// @desc    Create general broadcast notification
// @route   POST /api/admin/notifications
// @access  Private/Admin
export const sendNotification = async (req, res) => {
    try {
        const { title, message, type, link, recipientId } = req.body;

        if (!title || !message || !type) {
            return res.status(400).json({ message: 'Please provide title, message and type' });
        }

        const newNotification = await Notification.create({
            user: recipientId || null, // Can specify null for broadcast
            title,
            message,
            type,
            link: link || ""
        });

        // Log admin activity
        await Log.create({
            userId: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            action: 'admin_broadcast',
            details: `Sent ${type} notification: "${title}" ${recipientId ? `to user ${recipientId}` : 'to ALL users'}`
        });

        res.status(201).json({ success: true, message: 'Notification sent successfully', notification: newNotification });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Server error sending notification' });
    }
};

// @desc    Broadcast an email to ALL platform users
// @route   POST /api/admin/email-broadcast
// @access  Private/Admin
export const sendEmailBroadcast = async (req, res) => {
    try {
        const { subject, message, link } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: "Subject and message body are required" });
        }

        // Fetch all non-suspended users who opted into emails
        const users = await User.find({ 
            isSuspended: false,
            emailNotifications: { $ne: false } 
        }).select('email name');

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No active users found to email" });
        }

        const htmlContent = getBroadcastEmailTemplate(subject, message, link);

        // Loop and send email to each user
        // Loop and send email to each user sequentially to prevent rate-limiting flooding
        let successCount = 0;
        let failureCount = 0;

        for (const user of users) {
            try {
                await sendEmail({
                    email: user.email,
                    subject: subject,
                    message: htmlContent,
                    isHtml: true
                });
                successCount++;
                // Minimal pacing sleep (250ms) to protect API connection pools
                await new Promise(r => setTimeout(r, 250));
            } catch (err) {
                console.error(`Failed to send email to ${user.email}:`, err.message);
                failureCount++;
            }
        }

        // Log activity
        await Log.create({
            userId: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            action: 'admin_broadcast',
            details: `Sent email broadcast "${subject}" to ${successCount} users. (${failureCount} failed)`
        });

        res.json({ 
            success: true, 
            message: `Email broadcast finished. Success: ${successCount}, Failed: ${failureCount}`,
            successCount, 
            failureCount 
        });
    } catch (error) {
        console.error('Email broadcast handler error:', error);
        res.status(500).json({ message: 'Server error while launching email broadcast' });
    }
};
