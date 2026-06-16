import Container from "@/components/common/Container";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Container className="max-w-5xl px-4 md:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Liên Hệ</h1>
          <p className="text-slate-500 text-lg">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Thông tin liên hệ</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Địa chỉ</h3>
                  <p className="text-slate-600 mt-1">123 Đường Sách, Phường Đọc, Quận Trí Thức, TP. Hồ Chí Minh</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Điện thoại</h3>
                  <p className="text-slate-600 mt-1">1900 1234 56</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Email</h3>
                  <p className="text-slate-600 mt-1">support@cuahangsach.vn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Gửi tin nhắn</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Nhập tên của bạn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" placeholder="Nhập email của bạn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none" placeholder="Nhập tin nhắn..."></textarea>
              </div>
              <button type="button" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                Gửi liên hệ
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
