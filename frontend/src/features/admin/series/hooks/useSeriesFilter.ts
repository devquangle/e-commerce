import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import { BaseStatus } from "@/types/status";

const initialFilterOptions = {
  keyword: "",
  status: "",
  page: 1,
  size: 10,
};

export default function useSeriesFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword,
  );

  const [status, setStatus] = useState<BaseStatus | null>(
    () => (searchParams.get("status") as BaseStatus) ?? null,
  );

  const [page, setPage] = useState<number>(
    () => Number(searchParams.get("page")) || initialFilterOptions.page,
  );

  const [size, setSize] = useState<number>(
    () => Number(searchParams.get("size")) || initialFilterOptions.size,
  );

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedKeyword) {
      params.set("keyword", debouncedKeyword);
    }

    if (status) {
      params.set("status", status);
    }

    if (page !== initialFilterOptions.page) {
      params.set("page", String(page));
    }

    if (size !== initialFilterOptions.size) {
      params.set("size", String(size));
    }

    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, status, page, size, setSearchParams]);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: BaseStatus | null) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleResetFilter = useCallback(() => {
    setKeyword("");
    setStatus(null);
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  }, []);

  return {
    keyword,
    status,
    page,
    size,
    debouncedKeyword,

    setPage,
    setSize,

    handleKeywordChange,
    handleStatusChange,
    handleResetFilter,
  };
}
