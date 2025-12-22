import { useState } from "react";

export default function Search() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  return (
    <div className="flex items-center gap-2 flex-1 justify-end">
      <input
        type="text"
        placeholder="Tìm kiếm sách..."
        className={`
            transition-all duration-300 ease-in-out
            rounded-full border border-gray-300 px-4 py-2 text-sm
            outline-none
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-500
          ${
            isSearchOpen
              ? "w-full max-w-[500px] px-4 py-2 opacity-100"
              : "w-0 px-0 py-0 opacity-0 border-0"
          }
        `}
      />
      <button
       
        className="h-9 w-9 shrink-0 rounded-full border flex items-center justify-center cursor-pointer"
        onClick={() => setIsSearchOpen((prev) => !prev)}
        aria-label="Tìm kiếm"
      >
        🔍
      </button>
    </div>
  );
}
