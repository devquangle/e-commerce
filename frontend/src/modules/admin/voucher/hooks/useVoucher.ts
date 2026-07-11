import type { Pagination } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import type { VoucherResponse, VoucherSearchRequest } from "../types/voucher.type";
import VoucherService from "../services/voucher.service";


export const useFilterVoucher = (options?: VoucherSearchRequest) => {
  return useQuery<Pagination<VoucherResponse>>({
    queryKey: ["vouchers-filter", options],
    queryFn: () => VoucherService.searchVoucher(options),
  });
};
