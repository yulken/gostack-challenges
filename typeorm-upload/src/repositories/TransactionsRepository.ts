import { EntityRepository, Repository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

export interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;
    const transactions = await this.find();
    if (!transactions) {
      throw new AppError('Database request failed', 500);
    }
    const incomeList = transactions.filter(
      transaction => transaction.type === 'income',
    );
    if (incomeList.length !== 0) {
      income = incomeList
        .map(transaction => transaction.value)
        .reduce((totalIncome, value) => {
          return totalIncome + value;
        });
    }
    const outcomeList = transactions.filter(
      transaction => transaction.type === 'outcome',
    );
    if (outcomeList.length !== 0) {
      outcome = outcomeList
        .map(transaction => transaction.value)
        .reduce((totalOutcome, value) => {
          return totalOutcome + value;
        });
    }

    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
