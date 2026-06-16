const Project = require('../models/Project');
const Task = require('../models/Task');

// Simple In-Memory Cache
const cache = {};

// @desc    Get dashboard analytics summary
// @route   GET /api/analytics/summary
// @access  Private
exports.getSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Check cache (60 seconds)
        const cacheKey = `summary_${userId}`;
        const cachedData = cache[cacheKey];
        if (cachedData && (Date.now() - cachedData.timestamp < 60000)) {
            return res.json(cachedData.data);
        }

        // Run aggregations in parallel for performance
        const [
            totalProjects,
            totalTasks,
            taskStatusCounts
        ] = await Promise.all([
            Project.countDocuments({ owner: userId }),
            Task.countDocuments({ owner: userId }),
            Task.aggregate([
                { $match: { owner: req.user._id } }, // mongoose handles ObjectId conversion
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ])
        ]);

        let completedTasks = 0;
        let pendingTasks = 0;
        let todoTasks = 0;
        let inProgressTasks = 0;

        taskStatusCounts.forEach(status => {
            if (status._id === 'Completed') {
                completedTasks = status.count;
            } else if (status._id === 'In Progress') {
                inProgressTasks = status.count;
                pendingTasks += status.count;
            } else if (status._id === 'Todo') {
                todoTasks = status.count;
                pendingTasks += status.count;
            }
        });

        const completionPercentage = totalTasks > 0 
            ? Math.round((completedTasks / totalTasks) * 100) 
            : 0;

        const responseData = {
            metrics: {
                totalProjects,
                totalTasks,
                completedTasks,
                pendingTasks,
                completionPercentage
            },
            chartData: {
                taskDistribution: [
                    { name: 'Completed', value: completedTasks },
                    { name: 'In Progress', value: inProgressTasks },
                    { name: 'Todo', value: todoTasks }
                ],
                // Basic comparison for a bar chart
                volumeComparison: [
                    { name: 'Projects', count: totalProjects },
                    { name: 'Tasks', count: totalTasks }
                ]
            }
        };

        // Save to cache
        cache[cacheKey] = {
            timestamp: Date.now(),
            data: responseData
        };

        // We format it into something easily readable for Recharts
        res.json(responseData);
    } catch (error) {
        next(error);
    }
};
