import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const result = await transactionRepository.delete({ id });
    if (!result) {
      throw new AppError('Failed to delete transaction', 400);
    }
  }
}

export default DeleteTransactionService;
