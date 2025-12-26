export interface Product {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;   // có thì mới hiện giảm giá
    author: string[];
    coverUrl: string;

    publishedAt: string;
    soldCount: number;        // đã bán
    rating: number;           // 0 → 5
    reviewCount: number;      // số lượt đánh giá
    isFeatured: boolean;
}
