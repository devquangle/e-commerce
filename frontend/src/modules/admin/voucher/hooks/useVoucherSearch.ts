import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import { VoucherStatus } from "../types/voucher.status";

const initialFilterOptions = {
  keyword: "",
  status: "",
  startDate: "",
  endDate: "",
  page: 1,
  size: 10,
};

export default function useVoucherSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword,
  );

  const [status, setStatus] = useState<VoucherStatus | null>(
    () => (searchParams.get("status") as VoucherStatus) ?? null,
  );

  const [startDate, setStartDate] = useState(
    () => searchParams.get("startDate") ?? initialFilterOptions.startDate,
  );

  const [endDate, setEndDate] = useState(
    () => searchParams.get("endDate") ?? initialFilterOptions.endDate,
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

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    if (page !== initialFilterOptions.page) {
      params.set("page", String(page));
    }

    if (size !== initialFilterOptions.size) {
      params.set("size", String(size));
    }

    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, status, startDate, endDate, page, size, setSearchParams]);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: VoucherStatus | null) => {
    setStatus(value);
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

  const handleResetFilter = useCallback(() => {
    setKeyword("");
    setStatus(null);
    setStartDate("");
    setEndDate("");
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  }, []);

  return {
    keyword,
    status,
    startDate,
    endDate,
    page,
    size,
    debouncedKeyword,

    setPage,
    setSize,

    handleKeywordChange,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    handleResetFilter,
  };
}
