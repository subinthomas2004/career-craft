import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        // Generate a daily GLOBAL notification if not already present
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const todayNotification = await Notification.findOne({
            user: { $exists: false },
            type: { $in: ['interview', 'gd', 'quiz', 'skill', 'debate'] },
            createdAt: { $gte: startOfDay }
        });
        
        if (!todayNotification) {
            const dateStr = new Date().toDateString();
            let seed = 0;
            for (let i = 0; i < dateStr.length; i++) {
                seed += dateStr.charCodeAt(i);
            }

            const randomTips = [
                {
                    type: 'interview',
                    title: 'Daily Mock Interview Tip',
                    message: 'Confidence is key! Practice maintaining eye contact with the camera during AI interviews.',
                    link: '/dashboard/interview'
                },
                {
                    type: 'gd',
                    title: 'Communication Tip',
                    message: 'In Group Discussions, listening is as important as speaking. Acknowledge others\' points before adding yours.',
                    link: '/dashboard/group-discussion'
                },
                {
                    type: 'quiz',
                    title: 'Technical Refresh',
                    message: 'Did you know? Most technical rounds start with core CS fundamentals. Take a quick quiz to stay sharp.',
                    link: '/dashboard/technical-quiz'
                },
                {
                    type: 'skill',
                    title: 'Career Growth',
                    message: 'Placement season is coming! Use the Skill Gap analyzer to see which certifications can boost your profile.',
                    link: '/dashboard/skill-gap'
                },
                {
                    type: 'debate',
                    title: 'Argumentation Tip',
                    message: 'In debates, use the P.E.E.L method: Point, Evidence, Explanation, Link. It makes your arguments unshakeable.',
                    link: '/dashboard/debate'
                }
            ];
            
            const sharedTip = randomTips[seed % randomTips.length];
            
            // Check count of DAILY TIPS ONLY to cap their history, or just cap total global.
            const globalCount = await Notification.countDocuments({ user: { $exists: false } });
            if (globalCount >= 20) {
                const oldest = await Notification.find({ user: { $exists: false } }).sort({ createdAt: 1 }).limit(globalCount - 19);
                await Notification.deleteMany({ _id: { $in: oldest.map(n => n._id) } });
            }

            await Notification.create(sharedTip);
        }
        
        let notifications = [];
        
        // Respect user's push notification preference
        if (req.user.pushNotifications !== false) {
            // Fetch global notifications OR notifications addressed to THIS user
            notifications = await Notification.find({
                $or: [
                    { user: { $exists: false } },
                    { user: null },
                    { user: req.user._id }
                ]
            }).sort({ createdAt: -1 }).limit(20);
        }
        
        res.json({ success: true, notifications });
    } catch (error) {
        console.error("Fetch notifications error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
};

export const markRead = async (req, res) => {
    try {
        const notificationId = req.params.id || req.body.notificationId;
        
        if (!notificationId) {
            // Mark all as read for user specific ones
            await Notification.updateMany(
                { user: req.user._id, isRead: false },
                { $set: { isRead: true } }
            );
            return res.json({ success: true, message: "All notifications marked as read" });
        }

        const notif = await Notification.findOne({ _id: notificationId, user: req.user._id });
        if (!notif) {
             // Global ones are read only or we just simulate success
             return res.json({ success: true, message: "Marked as read" });
        }
        
        notif.isRead = true;
        await notif.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update notification" });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found or is global" });
        }
        await notification.deleteOne();
        res.json({ success: true, message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete notification" });
    }
};
