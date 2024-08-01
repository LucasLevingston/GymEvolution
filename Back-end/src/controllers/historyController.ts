import { History } from '@prisma/client';
import { HistoryRepository } from '../interfaces/user.interface';
import { HistoryService } from '../services/historyService';

class HistoryController {
  private historyController: HistoryRepository;

  constructor() {
    this.historyController = new HistoryService();
  }
  async getHistory(email: string): Promise<History[] | null> {
    try {
      const historyo = await this.historyController.getHistory(email);
      return historyo;
    } catch (error) {
      throw new Error();
    }
  }
}
export { HistoryController };
