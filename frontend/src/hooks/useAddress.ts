import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import addressService from "@/services/addressService";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtil";
import type { AddressRequest, AddressResponse } from "@/types/address";

/* ================= FETCH ================= */
export const useAddresses = () => {
  return useQuery<AddressResponse[]>({
    queryKey: ["addresses"],
    queryFn: addressService.getAddresses,
    staleTime: 1000 * 30,
  });
};

/* ================= CREATE ================= */
export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: addressService.createAddress,

    onSuccess: (newAddress: AddressResponse) => {
      // ⚡ UI update NGAY LẬP TỨC
      queryClient.setQueryData<AddressResponse[]>(
        ["addresses"],
        (old = []) => [newAddress, ...old], // id DESC feel
      );

      showSuccessToast("Thêm địa chỉ thành công");

      navigate("/account/address");

      // (OPTIONAL) sync server background
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }, 0);
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
    mutationFn: (id: number) => addressService.deleteAddress(id),

    onSuccess: (_: void, id: number) => {
      // ⚡ remove ngay khỏi UI
      queryClient.setQueryData<AddressResponse[]>(["addresses"], (old = []) =>
        old.filter((item) => item.id !== id),
      );

      showSuccessToast("Xoá thành công");

      // OPTIONAL sync server
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }, 0);
    },

    onError: () => {
      showErrorToast("Xoá thất bại");
    },
  });
};

/* ================= UPDATE ================== */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddressRequest }) =>
      addressService.updateAddress(id, data),

    onSuccess: (updatedAddress: AddressResponse) => {
      queryClient.setQueryData<AddressResponse[]>(
        ["addresses"],
        (old = []) =>
          old.map((item) =>
            item.id === updatedAddress.id ? updatedAddress : item
          )
      );

      showSuccessToast("Cập nhật địa chỉ thành công");

      navigate("/account/address");

      // optional sync
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }, 0);
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        showErrorToast(
          error.response?.data?.message || "Cập nhật thất bại"
        );
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
    queryFn: () => addressService.getAddressById(addressId!),
    enabled: !!addressId,
  });
};
/* ================= SET DEFAULT ================== */
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressService.setDefaultAddress(id),

    onSuccess: (_: void, id: number) => {
      // ⚡ remove ngay khỏi UI
      queryClient.setQueryData<AddressResponse[]>(["addresses"], (old = []) =>
        old.map((item) => ({
          ...item,
          default: item.id === id, // chỉ item này là default
        }))
      );
      showSuccessToast("Cập nhật địa chỉ mặc định thành công");

      // OPTIONAL sync server
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
      }, 0);
    },

    onError: () => {
      showErrorToast("Cập nhật địa chỉ mặc định thất bại");
    },
  });
};