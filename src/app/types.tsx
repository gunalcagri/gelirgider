// Define the shape of a category
export interface Category {
    id: string;
    name: string;
    limit: number;
}

// Define the shape of an income category
export interface IncomeCategory {
    id: string;
    name: string;
}

// Define the shape of an expense item
export interface ExpenseItem {
    id: string;
    description: string;
    amount: number;
    date: string; // Assuming date is stored as a string
    category: Category;
}

export interface IncomeItem {
    id: string;
    description: string;
    amount: number;
    category: IncomeCategory ;
    date: string;
  }

