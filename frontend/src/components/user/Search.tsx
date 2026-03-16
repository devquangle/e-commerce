import { useState } from "react";

export default function Search() {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex items-center gap-2 flex-1 justify-end">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Tìm kiếm sách..."
        className="
       hidden lg:flex 
          w-full max-w-md
          rounded-full border border-gray-300
          px-4 py-2 text-sm
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-500
        "
      />

      <button
        className="hidden lg:flex h-9 w-9 shrink-0 rounded-full border items-center justify-center cursor-pointer hover:bg-gray-100"
        aria-label="Tìm kiếm"
      >
        🔍
      </button>
    </div>
  );
}