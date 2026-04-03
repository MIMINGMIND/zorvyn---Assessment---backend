import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  static async getSummary(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    const summary = await DashboardService.getSummary(
      startDate as string,
      endDate as string
    );

    res.status(200).json(summary);
  }

  static async getCategoryTotals(req: Request, res: Response) {
    const { type, startDate, endDate } = req.query;

    if (!type || (type !== 'INCOME' && type !== 'EXPENSE')) {
      return res.status(400).json({ error: 'Valid type (INCOME or EXPENSE) is required' });
    }

    const totals = await DashboardService.getCategoryTotals(
      type as any,
      startDate as string,
      endDate as string
    );

    res.status(200).json(totals);
  }

  static async getRecentActivity(req: Request, res: Response) {
    const { limit } = req.query;
    const parsedLimit = limit ? parseInt(limit as string, 10) : 5;

    const activities = await DashboardService.getRecentActivity(parsedLimit);
    res.status(200).json(activities);
  }
}
