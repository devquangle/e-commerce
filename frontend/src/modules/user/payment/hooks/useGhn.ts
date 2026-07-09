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
      if (!request) throw new Error("Missing request data");
      return GHNService.getShippingFee(request);
    },
    enabled: !!request && !!request.toDistrictId && !!request.toWardCode,
    staleTime: 5 * 60 * 1000, // Cache phí ship trong 5 phút để tránh gọi API liên tục
  });
};
