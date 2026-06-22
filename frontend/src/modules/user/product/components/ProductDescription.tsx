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

    // Cho phép thời gian DOM render HTML xong
    const checkHeight = () => {
      const shouldShow = node.scrollHeight > 300;
      if (shouldShow !== showButton) {
        setShowButton(shouldShow);
      }
    };

    const rafId = window.requestAnimationFrame(checkHeight);
    
    // Fallback timer just in case images in HTML load later
    const timeoutId = setTimeout(checkHeight, 500);

    return () => {
      window.cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [product.description, showButton]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Mô tả sản phẩm</h2>
      
      <div className="relative">
        <div 
          ref={contentRef}
          className={`
            prose prose-sm md:prose-base max-w-none text-slate-600 leading-relaxed
            prose-p:mb-4 prose-a:text-blue-600 prose-img:rounded-xl prose-img:max-w-full
            overflow-hidden transition-all duration-300
            ${!isExpanded ? 'max-h-[300px]' : ''}
          `}
        >
          {/* MÔ TẢ HTML TỪ TIPTAP */}
          {product.description ? (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
             <>
               <p>
                 Marketing căn bản là cuốn sách gối đầu giường của mọi marketer. 
                 Trong phiên bản tái bản mới nhất, tác giả đã cập nhật thêm những xu hướng 
                 digital marketing hiện đại, giúp người đọc nắm bắt được sự chuyển dịch của thị trường.
               </p>
               <ul>
                 {product.isbn && <li>ISBN: {product.isbn}</li>}
                 {product.pages && <li>Số trang: {product.pages}</li>}
                 {product.publisherName && <li>Nhà xuất bản: {product.publisherName}</li>}
                 {product.publishYear && <li>Năm xuất bản: {product.publishYear}</li>}
                 {!product.isbn && <li>ISBN: 978-604-1-12345-6</li>}
                 {!product.pages && <li>Số trang: 720</li>}
                 {!product.publisherName && <li>Nhà xuất bản: Nhà Xuất Bản Trẻ</li>}
                 {!product.publishYear && <li>Năm xuất bản: 2024</li>}
               </ul>
             </>
          )}
        </div>
        
        {/* Lớp phủ mờ (Fade out gradient) khi chưa mở rộng */}
        {!isExpanded && showButton && (
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Nút Xem thêm / Thu gọn */}
      {showButton && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-8 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
}
