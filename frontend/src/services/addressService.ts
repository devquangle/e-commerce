import { apiAuth } from "@/configs/axios";
import type { AddressRequest, AddressResponse } from "@/types/address";
import type { ApiResponse } from "@/types/api-response";

const addressService = {
  async getAddresses() {
    const res =
      await apiAuth.get<ApiResponse<AddressResponse[]>>("/auth/addresses");
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch addresses failed");
    }
    return res.data.data;
  },
  async getAddressById(addressId: number) {
    const res = await apiAuth.get<ApiResponse<AddressResponse>>(
      `/auth/addresses/${addressId}`,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch address failed");
    }
    return res.data.data;
  },
  async createAddress(request: AddressRequest) {
    const res = await apiAuth.post<ApiResponse<AddressResponse>>(
      "/auth/addresses",
      request,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Create address failed");
    }
    return res.data.data;
  },
  async updateAddress(addressId: number, request: AddressRequest) {
    const res = await apiAuth.put<ApiResponse<AddressResponse>>(
      `/auth/addresses/${addressId}`,
      request,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update address failed");
    }
    return res.data.data;
  },
  async deleteAddress(addressId: number) {
    const res = await apiAuth.delete<ApiResponse<void>>(
      `/auth/addresses/${addressId}`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete address failed");
    }
    return;
  },
  async setDefaultAddress(addressId: number) {
    const res = await apiAuth.put<ApiResponse<void>>(
      `/auth/addresses/${addressId}/default`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Set default address failed");
    }
    return;
  },
};

export default addressService;
