// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    const balance = await transactionsRepository.getBalance();
    if (!balance) {
      throw new AppError('Database request failed', 500);
    }
    if (value > balance.total && type === 'outcome') {
      throw new AppError('Outcome transaction without a valid balance');
    }
    const dbCategory = await categoryRepository.findOne({
      where: { title: categoryTitle },
    });
    let category: Category;
    if (!dbCategory) {
      const newCategory = categoryRepository.create({ title: categoryTitle });
      category = await categoryRepository.save(newCategory);
    } else {
      category = dbCategory;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });
    const newTransaction = await transactionsRepository.save(transaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
