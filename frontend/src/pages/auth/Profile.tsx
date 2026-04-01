import InputField from "@/components/common/InputField";
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