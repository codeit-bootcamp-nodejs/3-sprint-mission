import { ProductTag } from '@prisma/client';

interface findAllProductsArg {
  offset?: string;
  limit?: string;
  sort?: string;
  search?: string;
}

interface createProductData {
  name: string;
  description?: string;
  price: number;
  userId: string;
  isSold?: boolean;
  tags?: ProductTag[];
  stock?: number;
  imageUrl?: string | null
}

interface updateData {
  name?: string;
  description?: string;
  price?: number;
  userId?: string;
  isSold?: boolean;
  tags?: ProductTag[];
  stock?: number;
  imageUrl?: string | null
}

export { updateData, createProductData, findAllProductsArg }