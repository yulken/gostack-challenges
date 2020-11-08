import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse/lib/sync';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, fileName);
    const csvFileExists = await fs.promises.stat(csvFilePath);
    const createTransaction = new CreateTransactionService();
    if (!csvFileExists) {
      throw new AppError('File was not found', 500);
    }
    const csvBuffer = fs.readFileSync(csvFilePath);
    const csvLines = csvParse(csvBuffer, {
      columns: ['title', 'type', 'value', 'category'],
      skip_empty_lines: true,
      ltrim: true,
      from_line: 2,
    }) as Request[];
    const transactions: Transaction[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const request of csvLines) {
      // eslint-disable-next-line no-await-in-loop
      const newTransaction = await createTransaction.execute({
        title: request.title,
        value: request.value,
        type: request.type,
        categoryTitle: request.category,
      });
      transactions.push(newTransaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
