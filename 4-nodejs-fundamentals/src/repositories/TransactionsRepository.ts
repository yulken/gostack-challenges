import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let income = 0;
    let outcome = 0;

    const incomeList = this.transactions.filter(
      transaction => transaction.type === 'income',
    );
    if (incomeList.length !== 0) {
      income = incomeList
        .map(transaction => transaction.value)
        .reduce((totalIncome, value) => {
          return totalIncome + value;
        });
    }
    const outcomeList = this.transactions.filter(
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

  public create({ title, value, type }: TransactionDTO): Transaction {
    const newTransaction = new Transaction({ title, value, type });
    this.transactions.push(newTransaction);
    return newTransaction;
  }
}

export default TransactionsRepository;
