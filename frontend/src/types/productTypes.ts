export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  user?: string;
  _id: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  quantity: number;
  description: string;
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
}

export interface CreateProductInput {
  name: string;
  price: number;
  image: string;
  brand: string;
  quantity: number;
  category: string;
  description: string;
  countInStock: number;
}

export interface UpdateProductInput {
  productId: string;
  formData: FormData;
}

export interface CreateReviewInput {
  productId: string;
  rating: number;
  comment: string;
}

export interface UploadImageResponse {
  message: string;
  image: string;
}

export interface DeleteProduct {
  productId?: string;
  message: string;
}
