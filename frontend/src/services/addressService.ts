import { apiAuth } from "@/configs/axios";
import type { AddressFrom } from "@/types/address";

const addressService = {
  async fetchAddresses() {
    const { data } = await apiAuth.get("/auth/addresses");
    return data;
  },
  async getAddressById(addressId: number) {
    const { data } = await apiAuth.get(`/auth/addresses/${addressId}`);
    return data;
  },
  async createAddress(request: AddressFrom) {
    const { data } = await apiAuth.post("/auth/addresses", request);
    return data;
  },
  async updateAddress(addressId: number, request: AddressFrom) {
    const { data } = await apiAuth.put(`/auth/addresses/${addressId}`, request);
    return data;
  },
  async deleteAddress(addressId: number) {
    const { data } = await apiAuth.delete(`/auth/addresses/${addressId}`);
    return data;
  },
};

export default addressService;
