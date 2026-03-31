import Container from "@/components/common/Container";
import { showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterConfirm() {
  const navigate = useNavigate();
  const verifyToken = new URLSearchParams(window.location.search).get("verifyToken");

  useEffect(() => {
    const checkToken = async () => {
      try {
        if (!verifyToken) {
          navigate("/home");
          return;
        }

        const res = await axios.get(`http://localhost:8080/register?verifyToken=${verifyToken}`);
        if (res.status === 200) {
          showSuccessToast(res.data?.message || "Xác thực tài khoản thành công!");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const serverData = error.response?.data;
          showSuccessToast(serverData?.message || "Xác thực tài khoản không thành công!");
        } else {
          showSuccessToast("Không thể kết nối đến máy chủ");
        }

        console.error("Error in effect:", error);
      }
    };

    checkToken();
  }, [navigate, verifyToken]);

  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-blue-50">
      <Container className="px-4 md:px-8">
        <div className="flex min-h-[80vh] items-center justify-center py-6">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-100 blur-2xl" />
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-indigo-100 blur-2xl" />

            <div className="relative p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700">
                  <svg
                    className="h-6 w-6 animate-spin text-blue-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 12a9 9 0 1 1-2.64-6.36"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h1 className="text-xl font-bold text-slate-900">Xác nhận đăng ký</h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Đang xác nhận tài khoản của bạn...
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:w-auto"
                >
                  Đi tới trang đăng nhập
                </Link>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition"
                >
                  Đăng nhập ngay
                </button>
              </div>

              <p className="mt-5 text-xs text-slate-500 leading-relaxed">
                Nếu bạn không thấy trang này hoặc email bị trễ, hãy kiểm tra lại hộp
                thư đến/Spam và thử lại sau vài phút.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}