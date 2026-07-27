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
    queryFn: AddressService.getAddresses
  });
};

/* ================= CREATE ================= */
export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AddressService.createAddress,
    onSuccess: async () => {
      sessionStorage.removeItem("address_count");
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
      await queryClient.invalidateQueries({ queryKey: ["address-count"] });
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
    onSuccess: async () => {
      sessionStorage.removeItem("address_count");
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
      await queryClient.invalidateQueries({ queryKey: ["address-count"] });
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
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

/* ================= COUNT ================== */
export const useCountAddressesByUser = () => {
  return useQuery<number>({
    queryKey: ["address-count"],
    queryFn: AddressService.getCountAddressesByUser,
    initialData: () => {
      const stored = sessionStorage.getItem("address_count");
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0) return parsed;
      }
      return undefined;
    },
  });
};

export const useCountAddress = (defaultCount = 1): number => {
  const { data: count } = useCountAddressesByUser();
  const queryClient = useQueryClient();
  const { data: addresses } = useAddresses();

  if (typeof count === "number" && count > 0) {
    return count;
  }

  if (addresses && Array.isArray(addresses) && addresses.length > 0) {
    return addresses.length;
  }

  const cached = queryClient.getQueryData<AddressResponse[]>(["addresses"]);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    return cached.length;
  }

  const storedCount = sessionStorage.getItem("address_count");
  if (storedCount) {
    const parsed = parseInt(storedCount, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return defaultCount;
};
