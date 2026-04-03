import Container from "@/components/common/Container";
import type { ResponseData } from "@/types/response-data";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";


export default function RegisterConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verifyToken = searchParams.get("verifyToken");

  const hasCalled = useRef(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (hasCalled.current || !verifyToken) {
      if (!verifyToken) navigate("/home");
      return;
    };
    hasCalled.current = true;

    const checkToken = async () => {
      try {
        const res = await axios.post<ResponseData>(`http://localhost:8080/verify-register`,
          { token: verifyToken }
        );

        setStatus("success");
        showSuccessToast(res.data.message || "Xác thực tài khoản thành công!");
      } catch (error: unknown) {
        setStatus("error");

        if (axios.isAxiosError(error)) {
          showErrorToast(error.response?.data?.message || "Xác thực thất bại");
        } else {
          showErrorToast("Có lỗi không xác định");
        }

      }
    };

    checkToken();
  }, [verifyToken, navigate]);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      const res = await axios.post(`http://localhost:8080/resend-verify-register`,
        { token: verifyToken }
      );
      showSuccessToast(res.data.message || "Đã gửi lại email xác thực!");
    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {
        showErrorToast(error.response?.data?.message || "Lỗi khi gửi lại email!");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-blue-50">
      <Container className="px-4 md:px-8">
        <div className="flex min-h-[80vh] items-center justify-center py-6">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="flex flex-col items-center text-center">
              {/* Icon thay đổi theo trạng thái */}
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 
                ${status === "success" ? "border-green-100 bg-green-50 text-green-600" :
                  status === "loading" ? "border-blue-100 bg-blue-50 text-blue-600" : "border-red-100 bg-red-50 text-red-600"}`}>
                {status === "loading" ? <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24">...</svg> :
                  status === "success" ? "✓" : "✕"}
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                {status === "success" ? "Tuyệt vời!" : "Xác nhận đăng ký"}
              </h1>

              <p className="mt-2 text-slate-600">
                {status === "loading" && "Chúng tôi đang kiểm tra thông tin tài khoản của bạn..."}
                {status === "success" && "Tài khoản của bạn đã sẵn sàng. Chào mừng bạn đến với Bookstore!"}
                {status === "error" && "Có lỗi xảy ra hoặc liên kết không hợp lệ."}
              </p>

              <div className="mt-8 w-full">
                {status === "success" && (
                  <button onClick={() => navigate("/login")} className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
                    Đăng nhập ngay
                  </button>
                )}

                {status === "error" && (
                  <button
                    disabled={isResending}
                    onClick={handleResendEmail}
                    className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {isResending ? "Đang gửi lại..." : "Gửi lại email xác thực"}
                  </button>
                )}


              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}