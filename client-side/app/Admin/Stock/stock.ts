export interface IStock {
  _id: string;
  name: string;
  sku: string;
  category: string;
  unit: 'kg' | 'grm' | 'ltr' | 'ml' | 'pcs' | 'pack';
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
  sellingPrice: number;
  expiryDate?: string | Date;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface StockSummary {
  totalItems: number;
  lowStockCount: number;
  totalValue: number;
  uniqueCategories: number;
}