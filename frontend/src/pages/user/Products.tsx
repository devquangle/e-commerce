import { useState } from "react";
import Container from '@/components/Container'
import FilterContent from "@/components/common/FilterContent";
import ProductCard from '@/components/common/ProductCard'
import type { Product } from '@/types/Product';



const products: Product[] = [
  {
    id: 1,
    title: 'Naruto Tập 1',
    price: 25000,
    originalPrice: 35000,
    author: ['Masashi Kishimoto'],
    coverUrl: 'https://picsum.photos/300/400?random=1',
    publishedAt: '2025-01-01',
    soldCount: 1520,
    rating: 4.8,
    reviewCount: 320,
    isFeatured: true
  },
  {
    id: 2,
    title: 'Naruto Tập 1 ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp',
    price: 25000,
    originalPrice: 35000,
    author: ['Masashi Kishimoto'],
    coverUrl: 'https://picsum.photos/300/400?random=1',
    publishedAt: '2025-01-01',
    soldCount: 1520,
    rating: 4.8,
    reviewCount: 320,
    isFeatured: true
  }, {
    id: 3,
    title: 'Naruto Tập 1',
    price: 25000,
    originalPrice: 35000,
    author: ['Masashi Kishimoto'],
    coverUrl: 'https://picsum.photos/300/400?random=1',
    publishedAt: '2025-01-01',
    soldCount: 1520,
    rating: 4.8,
    reviewCount: 320,
    isFeatured: true
  }, {
    id: 4,
    title: 'Naruto Tập 1',
    price: 25000,
    originalPrice: 35000,
    author: ['Masashi Kishimoto'],
    coverUrl: 'https://picsum.photos/300/400?random=1',
    publishedAt: '2025-01-01',
    soldCount: 1520,
    rating: 4.8,
    reviewCount: 320,
    isFeatured: true
  },
  {
    id: 5,
    title: 'Naruto Tập 1 ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp',
    price: 25000,
    originalPrice: 35000,
    author: ['Masashi Kishimoto'],
    coverUrl: 'https://picsum.photos/300/400?random=1',
    publishedAt: '2025-01-01',
    soldCount: 1520,
    rating: 4.8,
    reviewCount: 320,
    isFeatured: true
  }
];

/* ================= PAGE ================= */
export default function Products() {
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <Container className="p-4 md:p-8">

      {/* HEADER MOBILE */}
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h2 className="text-lg font-semibold">Sản phẩm</h2>
        <button
          onClick={() => setOpenFilter(true)}
          className="border p-2 rounded"
        >
          <svg
            className="w-8 h-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5.05 3C3.291 3 2.352 5.024 3.51 6.317l5.422 6.059v4.874c0 .472.227.917.613 1.2l3.069 2.25c1.01.742 2.454.036 2.454-1.2v-7.124l5.422-6.059C21.647 5.024 20.708 3 18.95 3H5.05Z" />
          </svg>
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ASIDE DESKTOP */}
        <aside className="hidden lg:block lg:w-1/4 border rounded-lg p-4 bg-white">
          <FilterContent />
        </aside>

        {/* PRODUCTS */}
        <main className="w-full lg:w-3/4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>

      {/* ================= MODAL FILTER MOBILE ================= */}
      {openFilter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 lg:hidden"
          onClick={() => setOpenFilter(false)}
        >
          <div
            className="bg-white w-[90%] max-w-md rounded-xl shadow-lg max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="font-semibold text-lg">Bộ lọc</h3>
              <button
                onClick={() => setOpenFilter(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1">
              <FilterContent />
            </div>

            {/* Footer */}
            <div className="border-t p-4">
              <button
                onClick={() => setOpenFilter(false)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
