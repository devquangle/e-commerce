package com.dev.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.bean.DistrictBean;
import com.dev.backend.bean.ProvinceBean;
import com.dev.backend.dto.ghn.DistrictDTO;
import com.dev.backend.dto.ghn.ProvinceDTO;
import com.dev.backend.dto.ghn.WardDTO;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;
import com.dev.backend.service.GHNService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class API_GHN_Controller {
    private final GHNService ghnService;

    @GetMapping("/public/ghn/provinces")
    public ResponseEntity<ResponseData<List<ProvinceDTO>>> getProvinces() {
        List<ProvinceDTO> provinceDTOs = ghnService.getProvinces();
        return ResponseUtil.success("Lấy danh sách tỉnh thành thành công", provinceDTOs);
    }

    @PostMapping("/public/ghn/districts")
    public ResponseEntity<ResponseData<List<DistrictDTO>>> getDistricts(@RequestBody ProvinceBean provinceBean) {
        List<DistrictDTO> districtDTOs = ghnService.getDistricts(provinceBean.getProvinceId());

        return ResponseUtil.success("Lấy danh sách quận huyện thành công", districtDTOs);
    }

    @PostMapping("/public/ghn/wards")
    public ResponseEntity<ResponseData<List<WardDTO>>> getWards(@RequestBody DistrictBean districtBean) {
        List<WardDTO> wardDTOs = ghnService.getWards(districtBean.getDistrictId());
        return ResponseUtil.success("Lấy danh sách phường xã thành công", wardDTOs);
    }

}
