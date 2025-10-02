import type { Category } from "./categoryTypes";
import type { Product } from "./productTypes";

export interface ShopState {
  categories: Category[];
  products: Product[];
  checked: string[];
  radio: string[];
  brandCheckboxes: Record<string, boolean>;
  checkBrands: string[];
  selectedBrand?: string;
}
