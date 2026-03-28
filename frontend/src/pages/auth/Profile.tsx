import { useAuth } from "@/context/useAuth";
import type { ProfileForm } from "@/types/profile";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Profile() {
  const { userInfo } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      fullName: userInfo?.fullName || "",
      email: userInfo?.email || "",
      phone: userInfo?.phone || "",
      street: userInfo?.street || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>(userInfo?.avatarUrl || "/images/default-avatar.png");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append(
        "profile",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch("/auth/me", {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        // handle validation errors from server
        if (result.data) {
          for (const field in result.data) {
            setError(field as keyof ProfileForm, {
              type: "server",
              message: result.data[field],
            });
          }
        }
        return;
      }

      alert("Cập nhật thành công!");
    } catch (err: unknown) {
      console.error(err);
      alert("Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tài khoản của tôi</h2>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Form thông tin */}
        <div className="flex-1">
          <form
            className="space-y-2 p-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Full Name */}
            <div className="space-y-1 mb-3">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                {...register("fullName", {
                  required: "Họ và tên không được để trống",
                  pattern: {
                    value: /^[a-zA-ZÀ-ỹ\s]+$/,
                    message: "Họ và tên không hợp lệ",
                  },
                })}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              {errors.fullName && (
                <span className="text-red-500 text-[13px] mt-1 ml-1 animate-in fade-in duration-200">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="user@example.com"
                {...register("email", {
                  required: "Email không được để trống",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ",
                  },
                })}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <p className="text-red-600 text-sm min-h-5">{errors.email?.message}</p>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="0901234567"
                {...register("phone", {
                  required: "Số điện thoại không được để trống",
                  pattern: {
                    value: /^[0-9]{9,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <p className="text-red-600 text-sm min-h-5">{errors.phone?.message}</p>
            </div>

            {/* Street */}
            <div className="space-y-1">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                id="street"
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
                {...register("street", {
                  required: "Địa chỉ không được để trống",
                  minLength: { value: 3, message: "Địa chỉ quá ngắn" },
                })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <p className="text-red-600 text-sm min-h-6 warp-break-words">{errors.street?.message}</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full lg:w-auto px-4 py-2 rounded text-white ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center lg:w-1/3 space-y-4 p-4">
          <img
            src={avatar}
            alt="avatar"
            className="w-32 h-32 rounded-full border object-cover"
          />
          <label className="cursor-pointer text-blue-500 hover:underline">
            Thay đổi ảnh
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
          <button className="w-full lg:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}