import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import type { PromotionFilter } from "../types/promotion.search.type";

const initialFilterOptions: Required<Omit<PromotionFilter, "startDate" | "endDate" | "promotionCampaignType" | "status" | "keyword">> & {
  keyword: string;
  startDate: string;
  endDate: string;
  promotionCampaignType: string;
  status: string;
} = {
  keyword: "",
  startDate: "",
  endDate: "",
  promotionCampaignType: "ALL",
  status: "ALL",
  page: 1,
  size: 10,
};

export default function useSearchPromotion() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState<string>(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword,
  );

  const [startDate, setStartDate] = useState<string>(
    () => searchParams.get("startDate") ?? initialFilterOptions.startDate,
  );

  const [endDate, setEndDate] = useState<string>(
    () => searchParams.get("endDate") ?? initialFilterOptions.endDate,
  );

  const [promotionCampaignType, setPromotionCampaignType] = useState<string>(
    () =>
      searchParams.get("promotionCampaignType") ??
      initialFilterOptions.promotionCampaignType,
  );

  const [status, setStatus] = useState<string>(
    () => searchParams.get("status") ?? initialFilterOptions.status,
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

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    if (promotionCampaignType && promotionCampaignType !== "ALL") {
      params.set("promotionCampaignType", promotionCampaignType);
    }

    if (status && status !== "ALL") {
      params.set("status", status);
    }

    if (page !== initialFilterOptions.page) {
      params.set("page", String(page));
    }

    if (size !== initialFilterOptions.size) {
      params.set("size", String(size));
    }

    setSearchParams(params, { replace: true });
  }, [
    debouncedKeyword,
    startDate,
    endDate,
    promotionCampaignType,
    status,
    page,
    size,
    setSearchParams,
  ]);

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

  const handleCampaignTypeChange = useCallback((value: string) => {
    setPromotionCampaignType(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleResetFilter = useCallback(() => {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    setPromotionCampaignType("ALL");
    setStatus("ALL");
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  }, []);

  return {
    keyword,
    startDate,
    endDate,
    promotionCampaignType,
    status,
    page,
    size,
    debouncedKeyword,

    setPage,
    setSize,

    handleKeywordChange,
    handleStartDateChange,
    handleEndDateChange,
    handleCampaignTypeChange,
    handleStatusChange,
    handleResetFilter,
  };
}
