import InputField from "@/components/common/InputField";
import { useAuth } from "@/context/useAuth";
import type { ProfileForm } from "@/types/profile";

import { getErrorMessage } from "@/utils/error";
import { mapServerErrors } from "@/utils/mapServerErrors";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiAuth } from "@/configs/api";

export default function Profile() {
  const { userInfo, setUserInfo } = useAuth();

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
      image: userInfo?.image || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>(userInfo?.image || "/images/default-avatar.png");
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
        formData.append("image", avatarFile);
      }

      const res = await apiAuth.post("/auth/me", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        showSuccessToast(res.data.message);
        console.log(res.data.data);
        setUserInfo(res.data.data);
      }

    } catch (error: unknown) {
      mapServerErrors(error, setError);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tài khoản của tôi</h2>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Form thông tin */}
        <div className="flex-1">
          <form
            className="space-y-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputField label="Họ và tên" name="fullName" type="text"
              placeholder="Họ và tên"
              register={register}
              rules={{
                required: "Họ và tên là bắt buộc",
                // pattern: {
                //     value: /^[a-zA-ZÀ-ỹ\s]+$/,
                // 
                // }
              }}
              error={errors?.fullName}
            />

            <InputField label="Email" name="email" type="email"
              placeholder="you@gmail.com"
              register={register}
              rules={{
                required: "Email là bắt buộc",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ"
                }
              }}
              error={errors?.email}
            />

            <InputField label="Số điện thoại" name="phone" type="text"
              placeholder="0123456789"
              register={register}
              rules={{
                required: "Số điện thoại là bắt buộc",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ"
                }
              }}
              error={errors?.phone}
            />

            <InputField label="Địa chỉ" name="street" type="text"
              placeholder="Địa chỉ"
              register={register}
              rules={{
                required: "Địa chỉ là bắt buộc",
              }}
              error={errors?.street}
            />



            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full lg:w-auto  cursor-pointer px-4 py-2 rounded text-white ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center lg:w-1/3 space-y-4 p-4">

          <div className="relative group w-32 h-32">

            <img
              src={avatar}
              alt="avatar"
              className="
      w-full h-full rounded-full border object-cover
      transition-transform duration-200
      group-hover:scale-105
    "
            />

            <div className="
  absolute inset-0 rounded-full
  flex items-center justify-center gap-3
  ">

              {/* VIEW */}
              <button
                type="button"
                onClick={() => window.open(avatar, "_blank")}
                className="
      p-2 bg-white shadow-md rounded-full
  opacity-0 group-hover:opacity-100
  transition-all duration-200
    cursor-pointer
      "
              >
                👁
              </button>

              {/* EDIT */}
              <label className="
       p-2 bg-white shadow-md rounded-full
  opacity-0 group-hover:opacity-100
  transition-all duration-200
        cursor-pointer
    ">
                ✏️
                <input type="file" className="hidden" onChange={handleAvatarChange} />
              </label>

            </div>
          </div>

          {/* fallback text */}
          <label className="cursor-pointer text-blue-500 hover:underline">
            Thay đổi ảnh
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>

          <button className="w-full lg:w-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer">
            Đổi mật khẩu
          </button>

        </div>
      </div>
    </div>
  );
}