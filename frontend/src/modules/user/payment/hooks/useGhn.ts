import { useQuery } from "@tanstack/react-query";
import GHNService from "../services/ghn.service";
import type { ShippingFeeRequest } from "../types/shipping-fee.types";

export const useShippingFee = (request: ShippingFeeRequest | null) => {
  return useQuery({
    queryKey: [
      "shipping-fee",
      request?.toDistrictId,
      request?.toWardCode,
      request?.weight,
    ],
    queryFn: () => {
      if (!request) return 0;
      return GHNService.getShippingFee(request);
    },
    enabled:
      !!request &&
      !!request.toDistrictId &&
      Number(request.toDistrictId) > 0 &&
      !!request.toWardCode &&
      String(request.toWardCode).trim() !== "",
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
