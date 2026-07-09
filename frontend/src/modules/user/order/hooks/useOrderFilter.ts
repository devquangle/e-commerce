import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import type { OrderStatus } from "../types/order.type";

export type OrderFilterForm = {
  keyword: string;
  createDate: string;
  endDate: string;
};

export function useOrderFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Khởi tạo state từ URL
  const [status, setStatus] = useState<OrderStatus | null>(
    (searchParams.get("status") as OrderStatus) || null
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [size, setSize] = useState(Number(searchParams.get("size")) || 10);

  const form = useForm<OrderFilterForm>({
    defaultValues: {
      keyword: searchParams.get("keyword") || "",
      createDate: searchParams.get("createDate") || "",
      endDate: searchParams.get("endDate") || "",
    },
  });

  const keyword = form.watch("keyword");
  const createDate = form.watch("createDate");
  const endDate = form.watch("endDate");

  // Sync state lên URL (có debounce nhẹ 300ms để tránh push URL liên tục khi gõ phím)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (createDate) params.set("createDate", createDate);
      if (endDate) params.set("endDate", endDate);
      if (status) params.set("status", status);
      if (page > 1) params.set("page", page.toString());
      if (size !== 10) params.set("size", size.toString());

      setSearchParams(params, { replace: true });
    }, 300);

    return () => clearTimeout(handler);
  }, [keyword, createDate, endDate, status, page, size, setSearchParams]);

  // Tự động reset về trang 1 khi các filter thay đổi (trừ thay đổi page)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [keyword, createDate, endDate, status, size]);

  const resetFilters = () => {
    setStatus(null);
    setPage(1);
    form.reset({ keyword: "", createDate: "", endDate: "" });
  };

  return {
    form,
    filters: {
      keyword,
      status,
      createDate,
      endDate,
      page,
      size,
    },
    setStatus,
    setPage,
    setSize,
    resetFilters,
  };
}
