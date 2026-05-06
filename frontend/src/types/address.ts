export interface AddressRequest {
  id: number;
  fullName: string;
  phone: string;
  provinceId?: number | undefined;
  districtId?: number | undefined;
  wardCode?: string | undefined;
  street: string;
  streetFull?: string;
  default: boolean;
}

export interface AddressResponse {
  id: number;
  fullName: string;
  phone: string;
  provinceId?: number | undefined;
  districtId?: number | undefined;
  wardCode?: string | undefined;
  street: string;
  streetFull?: string;
  default: boolean;
}

export interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

export interface District {
  DistrictID: number;
  DistrictName: string;
}

export interface Ward {
  WardCode: string;
  WardName: string;
}
