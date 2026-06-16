import Container from "@/components/common/Container";

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Container className="max-w-4xl px-4 md:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-center">
            Về Chúng Tôi
          </h1>
          <div className="prose max-w-none text-slate-600 leading-relaxed text-lg space-y-6">
            <p>
              Chào mừng bạn đến với <strong>Cửa Hàng Sách Trực Tuyến</strong>. Chúng tôi tự hào là một trong những nền tảng cung cấp sách hàng đầu, mang đến cho độc giả nguồn tri thức vô tận với chất lượng tốt nhất.
            </p>
            <p>
              Được thành lập với sứ mệnh lan toả văn hoá đọc, chúng tôi cam kết cung cấp 100% sách bản quyền từ các nhà xuất bản uy tín trong và ngoài nước. Dù bạn là người yêu văn học, đam mê kinh doanh hay đang tìm kiếm những cuốn sách thiếu nhi bổ ích, chúng tôi đều có thể đáp ứng.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-4">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <div className="text-3xl font-black text-blue-600 mb-2">10K+</div>
                <div className="font-medium text-slate-700">Đầu sách</div>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-2xl">
                <div className="text-3xl font-black text-amber-500 mb-2">50K+</div>
                <div className="font-medium text-slate-700">Khách hàng</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <div className="text-3xl font-black text-green-600 mb-2">100%</div>
                <div className="font-medium text-slate-700">Sách bản quyền</div>
              </div>
            </div>
            <p>
              Hãy cùng chúng tôi xây dựng một cộng đồng yêu sách vững mạnh và phát triển. Xin cảm ơn sự tin tưởng và đồng hành của quý khách!
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
