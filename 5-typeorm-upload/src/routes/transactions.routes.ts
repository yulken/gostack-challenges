import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import multer from 'multer';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoriesRepository = getRepository(Category);
  const transactions = await transactionsRepository.find();
  const categories = await categoriesRepository.find();
  const transactionsWithCategories = transactions.map(transaction => {
    const category = categories.find(
      categ => categ.id === transaction.category_id,
    );
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    const { id, title, type, value, created_at, updated_at } = transaction;
    return {
      id,
      title,
      type,
      value,
      created_at,
      updated_at,
      category: {
        id: category.id,
        title: category.title,
        created_at: category.created_at,
        updated_at: category.updated_at,
      },
    };
  });

  const balance = await transactionsRepository.getBalance();
  return response.json({ transactions: transactionsWithCategories, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    categoryTitle: category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();
  deleteTransaction.execute(id);
  return response.status(201).json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();
    const transactions = await importTransactions.execute(
      request.file.filename,
    );
    return response.json(transactions);
  },
);

export default transactionsRouter;
