import User from '../models/User.js';

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

        res.json({
            stats: [
                { label: "Total Users", value: totalUsers.toString(), change: "+0%", icon: "Users", trend: "neutral" },
                { label: "Active Sessions", value: activeSessions.toString(), change: "0%", icon: "Activity", trend: "neutral" },
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
