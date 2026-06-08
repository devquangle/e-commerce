package com.dev.backend.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Arrays;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.dto.series.SeriesRequest;
import com.dev.backend.dto.series.SeriesResponse;
import com.dev.backend.entity.Series;
import com.dev.backend.exception.DuplicateFieldException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.SeriesMapper;
import com.dev.backend.repository.SeriesRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.SeriesService;
import com.dev.backend.util.TextUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class SeriesServiceImpl implements SeriesService {
    private final SeriesRepository seriesRepository;
    private final SeriesMapper seriesMapper;

    @Override
    @Transactional
    public SeriesResponse add(SeriesRequest seriesRequest) {
        log.info("Đang thêm bộ series sách mới: {}", seriesRequest.getName());
        validate(seriesRequest);

        Series series = new Series();
        series.setName(seriesRequest.getName());
        series.setSlug(TextUtils.toSlug(seriesRequest.getName()));
        series.setDescription(seriesRequest.getDescription());
        series.setStatus(seriesRequest.getStatus());

        return seriesMapper.toDTO(save(series));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Series series = findById(id);
        seriesRepository.delete(series);
        log.info("Đã xóa bộ series sách có ID: {}", id);
    }

    @Override
    public boolean existsByName(String name) {
        return seriesRepository.existsByName(name);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return seriesRepository.existsBySlug(slug);
    }

    @Override
    public Series findById(Integer id) {
        return seriesRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Không tìm thấy bộ series sách với ID: " + id));
    }

    @Override
    @Transactional
    public void insertData() {
        log.info("Bắt đầu khởi tạo dữ liệu mẫu các Bộ Series sách nổi tiếng...");

        // Khởi tạo danh sách các bộ series sách kinh điển (Việt Nam & Thế giới)
        List<Series> defaultSeries = Arrays.asList(
            Series.builder()
                .name("Harry Potter")
                .slug(TextUtils.toSlug("Harry Potter"))
                .description("Hành trình trưởng thành của cậu bé phù thủy mồ côi Harry Potter tại trường phép thuật Hogwarts và cuộc chiến chống lại Chúa tể Hắc ám Voldemort.")
                .status(BaseStatus.ACTIVE)
                .build(),
            Series.builder()
                .name("Kính Vạn Hoa")
                .slug(TextUtils.toSlug("Kính Vạn Hoa"))
                .description("Chuỗi truyện học đường kinh điển của nhà văn Nguyễn Nhật Ánh, khắc họa những trò nghịch ngợm và các chuyến thám hiểm của bộ ba Quý róm, Tiểu Long, Hạnh.")
                .status(BaseStatus.ACTIVE)
                .build(),
            Series.builder()
                .name("Chúa Tể Những Chiếc Nhẫn")
                .slug(TextUtils.toSlug("Chúa Tể Những Chiếc Nhẫn"))
                .description("Bộ sử thi kỳ ảo huyền thoại về chuyến đi tiêu hủy chiếc nhẫn quyền lực của tộc Hobbit nhằm cứu vớt vùng Trung Địa khỏi thế lực bóng tối Sauron.")
                .status(BaseStatus.ACTIVE)
                .build(),
            Series.builder()
                .name("Sherlock Holmes")
                .slug(TextUtils.toSlug("Sherlock Holmes"))
                .description("Tượng đài bất hủ của dòng sách trinh thám thế giới, khắc họa chuỗi vụ án ly kỳ được bóc tách dưới bộ óc thiên tài của vị thám tử lập dị Sherlock Holmes.")
                .status(BaseStatus.ACTIVE)
                .build(),
            Series.builder()
                .name("Bão Táp Triều Trần")
                .slug(TextUtils.toSlug("Bão Táp Triều Trần"))
                .description("Bộ tiểu thuyết lịch sử trường thiên đồ sộ của nhà văn Hoàng Quốc Hải, tái hiện sinh động sự hưng thịnh và cuộc chiến chống Nguyên Mông hào hùng của nhà Trần.")
                .status(BaseStatus.ACTIVE)
                .build()
        );

        if (seriesRepository.count() ==0) {
            seriesRepository.saveAll(defaultSeries);
        }
        log.info("Hoàn thành khởi tạo dữ liệu cho Series sách!");
    }

    @Override
    public PageResponse<SeriesResponse> pages(int page, int size, String keyword, String status) {
     Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id"));

        BaseStatus baseStatus = (status == null || status.isBlank())
                ? null
                : BaseStatus.valueOf(status);

        Page<Series> seriesPage = seriesRepository
                .findByNameContainingIgnoreCase(keyword == null ? "" : keyword, baseStatus, pageable);

        List<SeriesResponse> items = seriesPage.getContent().stream().map(seriesMapper::toDTO).toList();

        return new PageResponse<>(
                items,
                seriesPage.getNumber(),
                seriesPage.getSize(),
                seriesPage.getTotalElements(),
                seriesPage.getTotalPages());
    }

    @Override
    @Transactional
    public Series save(Series series) {
        return seriesRepository.save(series);
    }

    @Override
    @Transactional
    public SeriesResponse update(Integer id, SeriesRequest seriesRequest) {
        log.info("Đang cập nhật bộ series sách có ID: {}", id);
        Series series = findById(id);

        // Chỉ validate trùng tên nếu người dùng thực sự thay đổi sang một tên khác
        if (!series.getName().equalsIgnoreCase(seriesRequest.getName())) {
            validate(seriesRequest);
        }

        // Thực hiện cập nhật thông tin qua Setter an toàn
        series.setName(seriesRequest.getName());
        series.setSlug(TextUtils.toSlug(seriesRequest.getName()));
        series.setDescription(seriesRequest.getDescription());
        series.setStatus(seriesRequest.getStatus());

        return seriesMapper.toDTO(save(series));
    }

    @Override
    public void validate(SeriesRequest seriesRequest) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());

        if (existsByName(seriesRequest.getName())) {
            errors.addError("name", "Tên bộ series sách này đã tồn tại.");
        }

        // Kiểm tra chéo cả slug tránh xung đột URL tĩnh (SEO URL)
        String slug = TextUtils.toSlug(seriesRequest.getName());
        if (existsBySlug(slug)) {
            errors.addError("slug", "Đường dẫn (slug) cho tên bộ series này đã bị trùng lặp.");
        }

        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
    }
}