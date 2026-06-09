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
import com.dev.backend.dto.publisher.PublisherRequest;
import com.dev.backend.dto.publisher.PublisherResponse;
import com.dev.backend.entity.Publisher;
import com.dev.backend.exception.DuplicateFieldException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.PublisherMapper;
import com.dev.backend.repository.PublisherRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.PublisherService;
import com.dev.backend.util.TextUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class PublisherServiceImpl implements PublisherService {
    private final PublisherRepository publisherRepository;
    private final PublisherMapper publisherMapper;



    @Override
    public List<PublisherResponse> findAll() {
        return publisherRepository.findAll().stream().map(publisherMapper::toDTO).toList();
    }

    @Override
    @Transactional
    public PublisherResponse add(PublisherRequest publisherRequest) {
        log.info("Đang thêm nhà xuất bản mới: {}", publisherRequest.getName());
        validate(publisherRequest);

        Publisher publisher = new Publisher();
        publisher.setName(publisherRequest.getName());
        publisher.setSlug(TextUtils.toSlug(publisherRequest.getName()));
        publisher.setStreet(publisherRequest.getStreet());
        publisher.setStatus(publisherRequest.getStatus());

        return publisherMapper.toDTO(save(publisher));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Publisher publisher = findById(id);
        publisherRepository.delete(publisher);
        log.info("Đã xóa nhà xuất bản có ID: {}", id);
    }

    @Override
    public boolean existsByName(String name) {
        return publisherRepository.existsByName(name);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return publisherRepository.existsBySlug(slug);
    }

    @Override
    public Publisher findById(Integer id) {
        return publisherRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Không tìm thấy nhà xuất bản với ID: " + id));
    }

    @Override
    @Transactional
    public void insertData() {
        log.info("Bắt đầu khởi tạo dữ liệu mẫu các Nhà xuất bản tại Việt Nam...");

        List<Publisher> defaultPublishers = Arrays.asList(
                Publisher.builder()
                        .name("Nhà xuất bản Kim Đồng")
                        .slug(TextUtils.toSlug("Nhà xuất bản Kim Đồng"))
                        .street("55 Quang Trung, Hai Bà Trưng, Hà Nội")
                        .status(BaseStatus.ACTIVE)
                        .build(),
                Publisher.builder()
                        .name("Nhà xuất bản Trẻ")
                        .slug(TextUtils.toSlug("Nhà xuất bản Trẻ"))
                        .street("161B Lý Chính Thắng, Quận 3, TP. Hồ Chí Minh")
                        .status(BaseStatus.ACTIVE)
                        .build(),
                Publisher.builder()
                        .name("Công ty Văn hóa Truyền thông Nhã Nam")
                        .slug(TextUtils.toSlug("Công ty Văn hóa Truyền thông Nhã Nam"))
                        .street("59 Đỗ Quang, Trung Hòa, Cầu Giấy, Hà Nội")
                        .status(BaseStatus.ACTIVE)
                        .build(),
                Publisher.builder()
                        .name("Nhà xuất bản Tổng hợp TP.HCM")
                        .slug(TextUtils.toSlug("Nhà xuất bản Tổng hợp TP.HCM"))
                        .street("62 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh")
                        .status(BaseStatus.ACTIVE)
                        .build(),
                Publisher.builder()
                        .name("Nhà xuất bản Phụ nữ Việt Nam")
                        .slug(TextUtils.toSlug("Nhà xuất bản Phụ nữ Việt Nam"))
                        .street("39 Hàng Chuối, Hai Bà Trưng, Hà Nội")
                        .status(BaseStatus.ACTIVE)
                        .build());

        if (publisherRepository.count() == 0) {
            publisherRepository.saveAll(defaultPublishers);
        }
        log.info("Hoàn thành quá trình khởi tạo dữ liệu!");
    }

    @Override
    public PageResponse<PublisherResponse> pages(int page, int size, String keyword, String status) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id"));

        BaseStatus baseStatus = (status == null || status.isBlank())
                ? null
                : BaseStatus.valueOf(status);

        Page<Publisher> publisherPage = publisherRepository
                .findByNameContainingIgnoreCase(keyword == null ? "" : keyword, baseStatus, pageable);

        List<PublisherResponse> items = publisherPage.getContent().stream().map(publisherMapper::toDTO).toList();

        return new PageResponse<>(
                items,
                publisherPage.getNumber(),
                publisherPage.getSize(),
                publisherPage.getTotalElements(),
                publisherPage.getTotalPages());
    }

    @Override
    @Transactional
    public Publisher save(Publisher publisher) {
        return publisherRepository.save(publisher);
    }

    @Override
    @Transactional
    public PublisherResponse update(Integer id, PublisherRequest publisherRequest) {
        log.info("Đang cập nhật nhà xuất bản có ID: {}", id);
        Publisher publisher = findById(id);

        if (!publisher.getName().equalsIgnoreCase(publisherRequest.getName())) {
            validate(publisherRequest);
        }

        publisher.setName(publisherRequest.getName());
        publisher.setSlug(TextUtils.toSlug(publisherRequest.getName()));
        publisher.setStreet(publisherRequest.getStreet());
        publisher.setStatus(publisherRequest.getStatus());

        return publisherMapper.toDTO(save(publisher));
    }

    @Override
    public void validate(PublisherRequest publisherRequest) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());

        if (existsByName(publisherRequest.getName())) {
            errors.addError("name", "Tên nhà xuất bản đã tồn tại.");
        }

        String slug = TextUtils.toSlug(publisherRequest.getName());
        if (existsBySlug(slug)) {
            errors.addError("slug", "Đường dẫn (slug) cho tên nhà xuất bản này đã tồn tại.");
        }

        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
    }
}