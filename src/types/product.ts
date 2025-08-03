export interface ProductDto {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  tags: string[];
  createdAt: Date;
  userId: string;
}

export interface ProductWithLikeDto extends ProductDto {
  isLiked: boolean;
}

/**
 * SimpleProductDto example:
 * {
 *  id: string,
 * name: string,
 * description?: string | null,
 * price: number,
 * tags: string[]
 * }
 */
export type SimpleProductDto = Omit<ProductDto, 'tags' | 'createdAt' | 'userId'>;

/**
 * CreateProductDto example:
 * {
 *  name: string,
 * description?: string | null,
 * price: number,
 * tags: string[],
 * userId: string
 * }
 */
export type CreateProductDto = Omit<ProductDto, 'id' | 'createdAt'>;

/**
 * PatchProductDto example:
 * {
 *  name?: string,
 * description?: string | null,
 * price?: number,
 * tags?: string[]
 * }
 */
export type PatchProductDto = Partial<Omit<CreateProductDto, 'userId'>>;