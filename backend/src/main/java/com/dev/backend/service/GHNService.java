package com.dev.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.dto.ghn.DistrictDTO;
import com.dev.backend.dto.ghn.GHNResponse;
import com.dev.backend.dto.ghn.ProvinceDTO;
import com.dev.backend.dto.ghn.WardDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GHNService {

    private String token = "376955c8-3d7b-11f1-a973-aee5264794df";
    private String url = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/";
    private final RestTemplate restTemplate;

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public List<ProvinceDTO> getProvinces() {
        HttpEntity<?> entity = new HttpEntity<>(headers());

        ResponseEntity<GHNResponse<ProvinceDTO>> response = restTemplate.exchange(
                url + "/province",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<GHNResponse<ProvinceDTO>>() {
                });

        if (response.getStatusCode() == HttpStatus.OK
                && response.getBody() != null
                && response.getBody().getCode() == 200) {

            Set<Integer> excludedIds = Set.of(2002, 298);
            List<ProvinceDTO> provinceDTOs = response.getBody().getData();

            List<ProvinceDTO> filtered = provinceDTOs.stream()
                    .filter(p -> !excludedIds.contains(p.getProvinceID()))
                    .collect(Collectors.toList());

            return filtered;
        }

        return List.of();
    }

    public List<DistrictDTO> getDistricts(Integer provinceId) {
        Map<String, Object> body = new HashMap<>();
        body.put("province_id", provinceId);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());

        ResponseEntity<GHNResponse<DistrictDTO>> response = restTemplate.exchange(
                url + "/district",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<GHNResponse<DistrictDTO>>() {
                });
        if (response.getStatusCode() == HttpStatus.OK
                && response.getBody() != null
                && response.getBody().getCode() == 200) {

            return response.getBody().getData();
        }

        return List.of();

    }

    public List<WardDTO> getWards(Integer districtId) {

        Map<String, Object> body = new HashMap<>();
        body.put("district_id", districtId);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());

        ResponseEntity<GHNResponse<WardDTO>> response = restTemplate.exchange(
                url + "/ward",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<GHNResponse<WardDTO>>() {
                });

        if (response.getStatusCode() == HttpStatus.OK
                && response.getBody() != null
                && response.getBody().getCode() == 200) {

            return response.getBody().getData();
        }

        return List.of();
    }

    public String getStreetFull(Integer provinceId, Integer districtId, String wardCode, String street) {
        List<ProvinceDTO> provinceDTOs = getProvinces();
        ProvinceDTO provinceDTO = provinceDTOs.stream()
                .filter(p -> p.getProvinceID().equals(provinceId))
                .findFirst()
                .orElse(null);

        if (provinceDTO == null) {
            return null;

        }

        List<DistrictDTO> districtDTOs = getDistricts(provinceId);
        DistrictDTO districtDTO = districtDTOs.stream()
                .filter(d -> d.getDistrictID().equals(districtId))
                .findFirst()
                .orElse(null);

        if (districtDTO == null) {
            return null;
        }

        List<WardDTO> wardDTOs = getWards(districtId);
        WardDTO wardDTO = wardDTOs.stream()
                .filter(w -> w.getWardCode().equals(wardCode))
                .findFirst()
                .orElse(null);

        if (wardDTO == null) {
            return null;
        }
        String streetFull = provinceDTO.getProvinceName() + ", " + districtDTO.getDistrictName() + ", "
                + wardDTO.getWardName() + ", "
                + street;

        return streetFull;
    }

}
