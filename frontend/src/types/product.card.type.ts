export interface ProductCard {
  id: number;
  slug: string; //url
  name: string;
  soldCount: number; // đã bán
  rating: number; // 0 → 5
  reviewCount: number; // số lượt đánh giá
  price: number;
  bage: string; //Sản phẩm mới , sắp ra mắt , bán chạy ... do backend chèn qua
  urlImage: string;
  promosionValue: number;
}
