import { apiAuth } from "@/configs/api";
import type { AddressFrom } from "@/types/address";

const addressService = {
  async fetchAddresses() {
    const { data } = await apiAuth.get("/auth/addresses");
    return data;
  },
  async createAddress(request: AddressFrom) {
    const { data } = await apiAuth.post("/auth/addresses", request);
    return data;
  },
  async updateAddress(id: number, request: AddressFrom) {
    const { data } = await apiAuth.put(`/auth/addresses/${id}`, request);
    return data;
  },
  async deleteAddress(id: number) {
    const { data } = await apiAuth.delete(`/auth/addresses/${id}`);
    return data;
  },
};

export default addressService;
