import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { showSuccessToast, showErrorToast } from "@/utils/toastUtil";
import type {
  AddressRequest,
  AddressResponse,
} from "@/modules/user/address/types/address";
import AddressService from "@/modules/user/address/services/address.service";

/* ================= FETCH ================= */
export const useAddresses = () => {
  return useQuery<AddressResponse[]>({
    queryKey: ["addresses"],
    queryFn: AddressService.getAddresses,
    staleTime: 5 * 60 * 1000,
  });
};

/* ================= CREATE ================= */
export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AddressService.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showSuccessToast("Thêm mới địa chỉ thành công!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        showErrorToast(error.response?.data?.message || "Thêm thất bại");
      } else {
        showErrorToast("Có lỗi không xác định");
      }
    },
  });
};
/* ================= DELETE ================= */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => AddressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showSuccessToast("Xóa địa chỉ thành công!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        showErrorToast(error.response?.data?.message || "Xoá thất bại");
      } else {
        showErrorToast("Có lỗi không xác định");
      }
    },
  });
};

/* ================= UPDATE ================== */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddressRequest }) =>
      AddressService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showSuccessToast("Cập nhật địa chỉ thành công!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        showErrorToast(error.response?.data?.message || "Cập nhật thất bại");
      } else {
        showErrorToast("Có lỗi không xác định");
      }
    },
  });
};
/* ================= DETAIL ================== */
export const useAddressDetail = (addressId?: number) => {
  return useQuery({
    queryKey: ["address", addressId],
    queryFn: () => AddressService.getAddressById(addressId!),
    enabled: !!addressId,
  });
};
/* ================= SET DEFAULT ================== */
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => AddressService.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showSuccessToast("Cập nhật địa chỉ thành công!");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        showErrorToast(error.response?.data?.message || "Cập nhật thất bại");
      } else {
        showErrorToast("Có lỗi không xác định");
      }
    },
  });
};
