import Repair from '../models/Repair.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const statusMatch = ['Pending', 'Diagnosed', 'In Progress'];
const completedMatch = ['Completed', 'Delivered'];

export const getDashboard = asyncHandler(async (req, res) => {
  const [totalRepairs, pendingRepairs, completedRepairs, revenueData, recentRepairs, statusBreakdown, monthlyRevenue] =
    await Promise.all([
      Repair.countDocuments(),
      Repair.countDocuments({ status: { $in: statusMatch } }),
      Repair.countDocuments({ status: { $in: completedMatch } }),
      Repair.aggregate([
        { $match: { status: { $in: completedMatch } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$finalCost' }
          }
        }
      ]),
      Repair.find()
        .populate('technician', 'name')
        .sort({ createdAt: -1 })
        .limit(6),
      Repair.aggregate([
        {
          $group: {
            _id: '$status',
            value: { $sum: 1 }
          }
        },
        { $sort: { value: -1 } }
      ]),
      Repair.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m',
                date: '$createdAt'
              }
            },
            revenue: {
              $sum: {
                $cond: [{ $in: ['$status', completedMatch] }, '$finalCost', 0]
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

  res.json({
    totalRepairs,
    pendingRepairs,
    completedRepairs,
    revenue: revenueData[0]?.totalRevenue || 0,
    recentRepairs,
    statusBreakdown: statusBreakdown.map((item) => ({
      name: item._id,
      value: item.value
    })),
    monthlyRevenue: monthlyRevenue.map((item) => ({
      name: item._id,
      revenue: item.revenue
    }))
  });
});
