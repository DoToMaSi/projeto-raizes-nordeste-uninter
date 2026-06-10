export type ProductCategory = 'tapiocas' | 'cuscuz' | 'bebidas';

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  sizes: ProductOption[];
  addons: ProductOption[];
}

export interface MenuItem {
  productId: string;
  price: number;
}

export interface StoreMenu {
  storeId: string;
  items: MenuItem[];
}

export interface MenuCategory {
  id: ProductCategory;
  label: string;
  products: MenuProduct[];
}

export interface MenuProduct extends Product {
  price: number;
}
