import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/useAuth";
import OrderService from "../services/order.service";
import type { OrderFilterRequest } from "../types/order.search.type";
import type { OrderStatus } from "../types/order.type";

export type OrderFilterForm = {
  keyword: string;
  startDate: string;
  endDate: string;
};

export function useOrderFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isInitialized, userInfo } = useAuth();

  // Khởi tạo state từ URL
  const [status, setStatus] = useState<OrderStatus | null>(
    (searchParams.get("status") as OrderStatus) || null
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [size, setSize] = useState(Number(searchParams.get("size")) || 10);

  const form = useForm<OrderFilterForm>({
    defaultValues: {
      keyword: searchParams.get("keyword") || "",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
    },
  });

  const keyword = form.watch("keyword");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  // Sync state lên URL (có debounce nhẹ 300ms để tránh push URL liên tục khi gõ phím)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (status) params.set("status", status);
      if (page > 1) params.set("page", page.toString());
      if (size !== 10) params.set("size", size.toString());

      setSearchParams(params, { replace: true });
    }, 300);

    return () => clearTimeout(handler);
  }, [keyword, startDate, endDate, status, page, size, setSearchParams]);

  // Tự động reset về trang 1 khi các filter thay đổi (trừ thay đổi page)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [keyword, startDate, endDate, status, size]);

  const resetFilters = () => {
    setStatus(null);
    setPage(1);
    form.reset({ keyword: "", startDate: "", endDate: "" });
  };

  const filterParams: OrderFilterRequest = {
    keyword: keyword ? keyword.trim() : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status || undefined,
    page,
    size,
  };

  const query = useQuery({
    queryKey: ["orders", userInfo?.code, filterParams],
    queryFn: () => OrderService.getMyOrders(filterParams),
    enabled: isInitialized && !!userInfo,
  });

  return {
    form,
    filters: {
      keyword,
      status,
      startDate,
      endDate,
      page,
      size,
    },
    filterParams,
    setStatus,
    setPage,
    setSize,
    resetFilters,
    // API data & query state
    orders: query.data?.items ?? [],
    totalItems: query.data?.totalItems ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    query,
  };
}
