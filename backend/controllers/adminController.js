import User from '../models/User.js';

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
    console.log("Admin getStats hit");
    try {
        const totalUsers = await User.countDocuments();
        // Since we don't have explicit models for these yet, we'll placeholder them or calculate what we can
        // Active sessions is hard without session store, so we'll use a placeholder or check recent logins if we tracked them (we don't currently)
        // Reports and Content are also placeholders for now

        res.json({
            stats: [
                { label: "Total Users", value: totalUsers.toString(), change: "+0%", icon: "Users", trend: "neutral" },
                { label: "Active Sessions", value: "0", change: "0%", icon: "Activity", trend: "neutral" },
                { label: "Pending Reports", value: "0", change: "0%", icon: "AlertTriangle", trend: "neutral" },
                { label: "Total Content", value: "0", change: "0%", icon: "FileText", trend: "neutral" },
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
