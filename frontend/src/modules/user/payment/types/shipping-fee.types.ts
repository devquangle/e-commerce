export interface ShippingFeeRequest {
  toDistrictId: number;
  toWardCode: string;
  weight: number | 0;
}
    