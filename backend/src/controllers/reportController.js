import Repair from '../models/Repair.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const completedStatuses = ['Completed', 'Delivered'];

export const getReports = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dailyRepairs, revenueSummary, statusAnalytics, technicianPerformance, todayRepairs] =
    await Promise.all([
      Repair.aggregate([
        { $match: { intakeDate: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$intakeDate'
              }
            },
            repairs: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $in: ['$status', completedStatuses] }, '$finalCost', 0]
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Repair.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $cond: [{ $in: ['$status', completedStatuses] }, '$finalCost', 0]
              }
            },
            averageTicket: {
              $avg: {
                $cond: [{ $in: ['$status', completedStatuses] }, '$finalCost', null]
              }
            }
          }
        }
      ]),
      Repair.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Repair.aggregate([
        {
          $group: {
            _id: {
              $ifNull: ['$technicianName', 'Unassigned']
            },
            repairs: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $in: ['$status', completedStatuses] }, '$finalCost', 0]
              }
            }
          }
        },
        { $sort: { repairs: -1 } }
      ]),
      Repair.find({ intakeDate: { $gte: today } }).sort({ intakeDate: -1 }).limit(10)
    ]);

  res.json({
    dailyRepairs: dailyRepairs.map((item) => ({
      date: item._id,
      repairs: item.repairs,
      revenue: item.revenue
    })),
    revenueSummary: {
      totalRevenue: revenueSummary[0]?.totalRevenue || 0,
      averageTicket: Math.round(revenueSummary[0]?.averageTicket || 0)
    },
    statusAnalytics: statusAnalytics.map((item) => ({
      name: item._id,
      count: item.count
    })),
    technicianPerformance: technicianPerformance.map((item) => ({
      name: item._id,
      repairs: item.repairs,
      revenue: item.revenue
    })),
    todayRepairs
  });
});
