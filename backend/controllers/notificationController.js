import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        // Generate a daily GLOBAL notification if not already present
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const todayNotification = await Notification.findOne({
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
            
            const count = await Notification.countDocuments();
            if (count >= 5) {
                const oldest = await Notification.find().sort({ createdAt: 1 }).limit(count - 4);
                await Notification.deleteMany({ _id: { $in: oldest.map(n => n._id) } });
            }

            await Notification.create(sharedTip);
        }
        
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);
        res.json({ success: true, notifications });
    } catch (error) {
        console.error("Fetch notifications error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
};

export const markRead = async (req, res) => {
    res.json({ success: true, message: "Global notifications are read-only" });
};

export const deleteNotification = async (req, res) => {
    res.json({ success: true, message: "Global notifications cannot be deleted by users" });
};
