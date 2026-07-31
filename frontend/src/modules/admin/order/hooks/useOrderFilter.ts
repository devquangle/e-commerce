import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import type { OrderFilterRequest } from "../types/order.search.type";
import type { OrderStatus } from "../types/order.type";

const initialFilterOptions = {
  keyword: "",
  startDate: "",
  endDate: "",
  status: null as OrderStatus | null,
  page: 1,
  size: 10,
};

export function useOrderFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState<string>(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword
  );

  const [startDate, setStartDate] = useState<string>(
    () => searchParams.get("startDate") ?? initialFilterOptions.startDate
  );

  const [endDate, setEndDate] = useState<string>(
    () => searchParams.get("endDate") ?? initialFilterOptions.endDate
  );

  const [status, setStatus] = useState<OrderStatus | null>(
    () => (searchParams.get("status") as OrderStatus) ?? initialFilterOptions.status
  );

  const [page, setPage] = useState<number>(
    () => Number(searchParams.get("page")) || initialFilterOptions.page
  );

  const [size, setSize] = useState<number>(
    () => Number(searchParams.get("size")) || initialFilterOptions.size
  );

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedKeyword) {
      params.set("keyword", debouncedKeyword.trim());
    }

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
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
  }, [debouncedKeyword, startDate, endDate, status, page, size, setSearchParams]);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
    setPage(1);
  }, []);

  const handleStartDateChange = useCallback((value: string) => {
    setStartDate(value);
    setPage(1);
  }, []);

  const handleEndDateChange = useCallback((value: string) => {
    setEndDate(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: OrderStatus | null) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleResetFilter = useCallback(() => {
    setKeyword(initialFilterOptions.keyword);
    setStartDate(initialFilterOptions.startDate);
    setEndDate(initialFilterOptions.endDate);
    setStatus(initialFilterOptions.status);
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  }, []);

  const filterParams: OrderFilterRequest = {
    keyword: debouncedKeyword ? debouncedKeyword.trim() : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status || undefined,
    page,
    size,
  };

  return {
    keyword,
    startDate,
    endDate,
    status,
    page,
    size,
    debouncedKeyword,
    filterParams,

    setPage,
    setSize,

    handleKeywordChange,
    handleStartDateChange,
    handleEndDateChange,
    handleStatusChange,
    handleResetFilter,
  };
}
