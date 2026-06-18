package com.dev.backend.service.impl;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.entity.Genre;
import com.dev.backend.service.ExcelService;
import com.dev.backend.service.GenreService;
import com.dev.backend.util.TextUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExcelServiceImpl implements ExcelService {

    private final GenreService genreService;

    @Override
    public boolean hasExcelFormat(MultipartFile file) {
        String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        return TYPE.equals(file.getContentType());
    }

    @Override
    public int importGenresFromExcel(MultipartFile file) { // Thay đổi sang kiểu int
        try (InputStream is = file.getInputStream();
            Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            List<Genre> genres = new ArrayList<>();
            int rowNumber = 0;

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                String genreName = "";
                if (currentRow.getCell(0) != null) {
                    genreName = currentRow.getCell(0).getStringCellValue().trim();
                }

                // 1. Nếu tên rỗng -> Bỏ qua dòng này luôn
                if (genreName.isEmpty()) {
                    continue;
                }

                // 2. Nếu tên đã tồn tại trong DB -> Tự động bỏ qua
                if (genreService.existsByName(genreName)) {
                    log.warn("Thể loại '{}' đã tồn tại, tự động bỏ qua dòng này.", genreName);
                    continue; 
                }

                // 3. Nếu chưa tồn tại thì tiến hành map dữ liệu
                Genre genre = new Genre();
                genre.setName(TextUtils.capitalizeFully(genreName));
                genre.setSlug(TextUtils.toSlug(genreName));
                genre.setUrlImage(TextUtils.urlImage(genreName));
                genre.setStatus(BaseStatus.ACTIVE);

                genres.add(genre);
            }

            // Chỉ lưu và trả về số lượng nếu danh sách có dữ liệu mới
            if (!genres.isEmpty()) {
                genreService.saveAll(genres);
                log.info("Import thành công {} genres mới từ file Excel.", genres.size());
                return genres.size(); // Trả về số lượng bản ghi đã thêm
            } else {
                log.info("Không có thể loại nào mới được thêm.");
                return 0; // Trả về 0 nếu tất cả đều bị trùng hoặc file trống
            }

        } catch (Exception e) {
            log.error("Lỗi khi import file Excel: ", e);
            throw new RuntimeException("Lỗi khi import file Excel: " + e.getMessage());
        }
    }
}