export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sizeId: string;
  sizeName: string;
  addonIds: string[];
  addonNames: string[];
  unitPrice: number;
  quantity: number;
}
