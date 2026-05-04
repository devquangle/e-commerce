import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import addressService from "@/services/addressService";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtil";
import type { AddressFrom } from "@/types/address";

/* ================= SORT ================= */
const sortByDefault = (data: AddressFrom[]) => {
  return [...data].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault)
  );
};

/* ================= FETCH ADDRESSES ================= */
export const useAddresses = () => {
  return useQuery<AddressFrom[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await addressService.fetchAddresses();
      const data = res.data.data ?? res.data ?? [];
      return sortByDefault(data);
    },
    staleTime: 1000 * 3,
  });
};

/* ================= CREATE ================= */
export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: addressService.createAddress,

    onSuccess: (res) => {
      const newAddress: AddressFrom = res.data;

      // ⚡ update UI ngay
      queryClient.setQueryData<AddressFrom[]>(
        ["addresses"],
        (old = []) => sortByDefault([...old, newAddress])
      );

      showSuccessToast(res.message || "Thêm địa chỉ thành công");

      // 🔄 sync server background (không delay UI)
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
        refetchType: "inactive",
      });

      navigate("/account/address");
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        showErrorToast(
          error.response?.data?.message || "Thêm địa chỉ thất bại"
        );
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
    mutationFn: addressService.deleteAddress,

    onSuccess: (_, id: number) => {
      queryClient.setQueryData<AddressFrom[]>(
        ["addresses"],
        (old = []) =>
          sortByDefault(old.filter((item) => item.id !== id))
      );

      showSuccessToast("Xoá thành công");

      queryClient.invalidateQueries({
        queryKey: ["addresses"],
        refetchType: "inactive",
      });
    },

    onError: () => {
      showErrorToast("Xoá thất bại");
    },
  });
};

/* ================= SET DEFAULT ================= */
// export const useSetDefaultAddress = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: null,

//     onSuccess: (_, id: number) => {
//       queryClient.setQueryData<AddressFrom[]>(
//         ["addresses"],
//         (old = []) =>
//           sortByDefault(
//             old.map((item) => ({
//               ...item,
//               isDefault: item.id === id,
//             }))
//           )
//       );

//       showSuccessToast("Cập nhật mặc định thành công");

//       queryClient.invalidateQueries({
//         queryKey: ["addresses"],
//         refetchType: "inactive",
//       });
//     },
//   });
// };