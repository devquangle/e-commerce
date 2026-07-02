import { ArrowLeft, HelpCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Illustration Icon */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-xl">
            <div className="w-40 h-40 bg-indigo-500 rounded-full"></div>
          </div>
          <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-slate-100 animate-bounce duration-1000">
            <HelpCircle size={64} className="text-indigo-600" />
          </div>
        </div>
        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-8xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800">
            Không tìm thấy trang
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
            Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển. Vui lòng kiểm tra lại địa chỉ URL hoặc quay lại trang chủ.
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer shadow-md shadow-indigo-100"
          >
            <Home size={16} />
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
