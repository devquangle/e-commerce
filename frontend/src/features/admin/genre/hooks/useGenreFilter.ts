import useDebounce from "@/hooks/useDebounce";
import type { BaseStatus } from "@/types/status";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useGenreFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(
    () => searchParams.get("keyword") ?? "",
  );

  const [status, setStatus] = useState<BaseStatus | null>(
    () => (searchParams.get("status") as BaseStatus) ?? null,
  );

  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);

  const [size, setSize] = useState(
    () => Number(searchParams.get("size")) || 10,
  );

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedKeyword) params.set("keyword", debouncedKeyword);
    if (status) params.set("status", status);

    setSearchParams(params, {
      replace: true,
    });
  }, [debouncedKeyword, status, searchParams, setSearchParams]);

  const resetFilter = () => {
    setKeyword("");
    setStatus(null);
    setPage(1);
    setSize(10);
  };

  return {
    keyword,
    setKeyword,
    status,
    setStatus,
    page,
    setPage,
    size,
    setSize,
    debouncedKeyword,
    resetFilter,
  };
};
