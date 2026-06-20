import { useState, useRef, useEffect } from "react";
import type { ProductResponse } from "../types/product.detail.type";

interface ProductDescriptionProps {
  product: Partial<ProductResponse>;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const shouldShow = node.scrollHeight > 250;
    if (shouldShow === showButton) return;

    const rafId = window.requestAnimationFrame(() => {
      setShowButton(shouldShow);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [product.description, showButton]);

  return (
    <div className= "bg-white rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-10 mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Mô tả sản phẩm</h2>
      <div className="relative">
        <div 
          ref={contentRef}
          className={`prose max-w-none text-slate-600 leading-relaxed text-base overflow-hidden transition-all duration-300 ${!isExpanded ? 'max-h-[250px]' : ''}`}
        >
          <p>{product.description}</p>
          
          <ul className="list-disc pl-5 mt-4 space-y-2 font-medium text-slate-700">
            {product.isbn && <li>ISBN: {product.isbn}</li>}
            {product.pages && <li>Số trang: {product.pages}</li>}
            {product.publisherName && <li>Nhà xuất bản: {product.publisherName}</li>}
            {product.publishYear && <li>Năm xuất bản: {product.publishYear}</li>}
            {!product.isbn && <li>Khổ sách: 14x20.5 cm</li>}
            {!product.pages && <li>Số trang: 350 trang</li>}
            {!product.publisherName && <li>Nhà xuất bản: NXB Trẻ</li>}
          </ul>

          {!product.description && (
             <>
               <p>
                 Nội dung chi tiết sẽ được trình bày ở đây. Bạn có thể sử dụng HTML content tĩnh hoặc động từ API.
               </p>
               <br />
               <p>
                 Cuốn sách này cung cấp một cái nhìn sâu sắc và toàn diện về lĩnh vực, 
                 với những phân tích chuyên sâu và ví dụ thực tế. Nó được thiết kế để 
                 giúp độc giả nắm bắt kiến thức một cách nhanh chóng và hiệu quả.
               </p>
               <br />
               <p>
                 Bên cạnh đó, các tác giả cũng chia sẻ những kinh nghiệm quý báu 
                 được đúc kết từ nhiều năm nghiên cứu và làm việc thực tế.
               </p>
             </>
          )}
        </div>
        
        {!isExpanded && showButton && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {showButton && (
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-8 py-2.5 text-blue-600 border border-blue-200 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-sm"
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
}
