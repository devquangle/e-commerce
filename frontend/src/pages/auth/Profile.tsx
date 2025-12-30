import { useState } from "react";

export default function Profile() {
  const [avatar, setAvatar] = useState<string>("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
    // TODO: upload lên server
  };

  return (
    <div className="flex flex-col lg:flex-row">
     
      <div className="flex-1">
        <form className="space-y-5 p-2">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Nguyen Van A"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="user@example.com"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="0901234567"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input
              type="text"
              name="address"
              id="address"
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <button className="w-full lg:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Lưu thay đổi
          </button>
        </form>
      </div>

    
      <div className="flex flex-col items-center lg:w-1/3 space-y-4 p-4">
        <img
          src={avatar || "/images/default-avatar.png"}
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

  );
}
