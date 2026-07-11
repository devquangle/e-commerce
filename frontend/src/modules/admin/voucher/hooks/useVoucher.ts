import type { Pagination } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VoucherRequest, VoucherResponse, VoucherSearchRequest } from "../types/voucher.type";
import VoucherService from "../services/voucher.service";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";


export const useFilterVoucher = (options?: VoucherSearchRequest) => {
  return useQuery<Pagination<VoucherResponse>>({
    queryKey: ["vouchers-filter", options],
    queryFn: () => VoucherService.searchVoucher(options),
  });
};

export const useGetVoucherById = (id: number) => {
  return useQuery<VoucherResponse>({
    queryKey: ["voucher", id],
    queryFn: () => VoucherService.getVoucherById(id),
  });
}

export const useCreateVoucher = ()=>{
    const queryClient = useQueryClient();
    
  return useMutation({
    mutationFn: (req: VoucherRequest) => VoucherService.createVoucher(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers-filter"] });
      showSuccessToast("Thêm mới voucher thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm nhà xuất bản.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });

}