package com.dev.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface ExcelService {
    boolean hasExcelFormat(MultipartFile file);

    int importGenresFromExcel(MultipartFile file);
}
