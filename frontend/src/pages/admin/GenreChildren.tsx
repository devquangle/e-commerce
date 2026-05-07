import type { ChildGenreResponse } from "@/types/genre";
import { useState } from "react";

type Props = {
  children?: ChildGenreResponse[];
};

export default function GenreChildren({ children = [] }: Props) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? children : children.slice(0, 5);

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visible.map((child) => (
        <span
          key={child.id}
          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-md"
        >
          {child.name}
        </span>
      ))}

      {children.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-500 hover:underline ml-1"
        >
          {expanded ? "Thu gọn" : `+${children.length - 5} thêm`}
        </button>
      )}
    </div>
  );
}