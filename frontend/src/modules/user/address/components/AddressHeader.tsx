import { useNavigate } from "react-router-dom";

export default function AddressHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center gap-3 mb-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Danh sách địa chỉ
      </h2>

      <button
        type="button"
        onClick={() => navigate("/account/create-address")}
        className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition"
      >
        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>

        {/* Text */}
        <span className="hidden lg:inline">
          Thêm địa chỉ mới
        </span>
      </button>
    </div>
  );
}
