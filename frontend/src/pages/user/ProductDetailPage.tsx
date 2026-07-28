import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "@/components/common/Container";
import ProductDescription from "@/modules/user/product-detail/components/ProductDescription";
import ProductImages from "@/modules/user/product-detail/components/ProductImages";
import ProductInfo from "@/modules/user/product-detail/components/ProductInfo";
import ProductTable from "@/modules/user/product-detail/components/ProductTable";
import useProductDetailData from "@/modules/user/product-detail/hooks/useProductDetailData";

export default function ProductDetailPage() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug");

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const { productInfo } = useProductDetailData(slug || "");
  const product = productInfo.data;

  if (productInfo.isLoading) {
    return (
      <Container className="max-w-7xl p-2 min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-500 font-medium text-lg animate-pulse">
          Đang tải thông tin sản phẩm...
        </div>
      </Container>
    );
  }

  if (!slug || !product || productInfo.isError) {
    return (
      <Container className="max-w-7xl p-2 min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-2xl font-bold text-slate-700">Chưa có dữ liệu</div>
        <p className="text-sm text-slate-500 max-w-md">
          Sản phẩm không tồn tại hoặc thông tin sản phẩm chưa được cập nhật.
        </p>
      </Container>
    );
  }

  return (
    <Container className="max-w-7xl p-2">
      {/* 2-Column layout for Main Product & Specifications & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-4 items-start">
        {/* LEFT COLUMN: Images */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit flex flex-col gap-4">
          <div className="card-custom">
            <ProductImages product={product} />
          </div>
        </div>

        {/* RIGHT COLUMN: Info, Specs Table, Description */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="card-custom">
            <ProductInfo
              product={product}
              review={{ rating: 5.0, reviewCount: 0 }}
            />
          </div>

          <ProductTable product={product} />
          <ProductDescription product={product} />
        </div>
      </div>
    </Container>
  );
}
