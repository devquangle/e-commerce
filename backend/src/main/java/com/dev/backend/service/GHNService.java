package com.dev.backend.service;


import java.util.List;


import com.dev.backend.dto.ghn.CalculateFeeRequest;
import com.dev.backend.dto.ghn.DistrictDTO;
import com.dev.backend.dto.ghn.ProvinceDTO;
import com.dev.backend.dto.ghn.WardDTO;

public interface GHNService {

   List<ProvinceDTO> getProvinces();

    List<DistrictDTO> getDistricts(Integer provinceId);

    List<WardDTO> getWards(Integer districtId);

    String getStreetFull(
            Integer provinceId,
            Integer districtId,
            String wardCode,
            String street);

    Integer calculateFee(CalculateFeeRequest request);
}
