export class Product {
  id!: string;
  name!: string;
  description: string = '';
  price!: number;
  tags?: string;
  createdAt!: Date;
  updatedAt!: Date;
  quantity: number = 0;
  userId?: number;
}