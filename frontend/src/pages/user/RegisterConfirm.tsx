import Container from "@/components/common/Container";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterConfirm() {
  const navigate = useNavigate();
  const hasCalled = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [isResending, setIsResending] = useState(false);

  const getToken = () =>
    new URLSearchParams(window.location.search).get("verifyToken");

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const checkToken = async () => {
      const verifyToken = getToken();
      if (!verifyToken) {
        navigate("/home");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/register?verifyToken=${verifyToken}`
        );

        if (res.data.success) {
          setStatus("success");
          showSuccessToast(res.data.message || "Xác thực tài khoản thành công!");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus("error");
          showErrorToast(res.data.message || "Xác thực tài khoản không thành công!");
        }
      } catch (error: unknown) {
        setStatus("error");
        if (axios.isAxiosError(error)) {
          const serverData = error.response?.data;
          showErrorToast(serverData?.message || "Xác thực tài khoản không thành công!");
        }
      }
    };

    checkToken();
  }, [navigate]);

  const handleResendEmail = async () => {
    const verifyToken = getToken();
    if (!verifyToken) return;

    try {
      setIsResending(true);
      const res = await axios.get(
        `http://localhost:8080/resend-email?verifyToken=${verifyToken}`
      );

      if (res.data.success) {
        showSuccessToast(res.data.message || "Đã gửi lại email xác thực!");
      } else {
        showErrorToast(res.data.message || "Gửi lại email thất bại!");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverData = error.response?.data;
        showErrorToast(serverData?.message || "Lỗi khi gửi lại email xác thực!");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-blue-50">
      <Container className="px-4 md:px-8">
        <div className="flex min-h-[80vh] items-center justify-center py-6">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="relative p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700">
                  {status === "loading" && (
                    <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
                      <path
                        d="M21 12a9 9 0 1 1-2.64-6.36"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {status === "success" && <span className="text-green-600">✓</span>}
                  {status === "error" && <span className="text-red-600">✕</span>}
                </div>

                <div className="flex-1">
                  <h1 className="text-xl font-bold text-slate-900">Xác nhận đăng ký</h1>
                  <p className="mt-1 text-sm text-slate-600">
                    {status === "loading" && "Đang xác nhận tài khoản..."}
                    {status === "success" && "Xác thực thành công! Đang chuyển hướng..."}
                    {status === "error" && "Xác thực tài khoản không thành công"}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-between">
                {status !== "loading" && (
                  <button
                    onClick={status === "error" ? handleResendEmail : () => navigate("/login")}
                    disabled={isResending && status === "error"}
                    className={`inline-flex w-full sm:w-auto items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${status === "success" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 disabled:opacity-50"
                      }`}
                  >
                    {status === "success" ? "Đăng nhập ngay" : isResending ? "Đang gửi..." : "Gửi lại email"}
                  </button>
                )}
              </div>

              <p className="mt-5 text-xs text-slate-500">
                Nếu bạn không thấy email, hãy kiểm tra Spam hoặc thử lại.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}