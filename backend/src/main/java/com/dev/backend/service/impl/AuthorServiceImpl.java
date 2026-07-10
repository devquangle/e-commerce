package com.dev.backend.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.dto.author.AuthorFilterRequest;
import com.dev.backend.dto.author.AuthorRequest;
import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.dto.author.AuthorWithProductCountResponse;
import com.dev.backend.dto.wikipedia.WikipediaResponse;
import com.dev.backend.entity.Author;
import com.dev.backend.exception.DuplicateFieldException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.AuthorMapper;
import com.dev.backend.repository.AuthorRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.AuthorService;
import com.dev.backend.service.WikipediaService;
import com.dev.backend.util.TextUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;
    private final WikipediaService wikipediaService;

    @Override
    public List<AuthorResponse> findAll() {
        return authorRepository.findAll().stream().map(authorMapper::toDTO).toList();
    }

    @Override
    public AuthorResponse add(AuthorRequest authorRequest) {
        validate(authorRequest);
        Author author = new Author();
        author.setName(TextUtils.capitalizeFully(authorRequest.getName()));
        author.setWikibaseItem(authorRequest.getWikibaseItem());
        author.setSlug(TextUtils.toSlug(authorRequest.getName()));
        author.setUrlBio(authorRequest.getUrlBio());
        author.setUrlImage(authorRequest.getUrlImage());
        author.setDescription(authorRequest.getExtract());
        author.setStatus(authorRequest.getStatus() != null ? authorRequest.getStatus() : BaseStatus.ACTIVE);
        return authorMapper.toDTO(save(author));
    }

    @Override
    public Author findById(Integer id) {
        return authorRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Không tìm thấy tác giả với ID: " + id));
    }

    @Override
    public AuthorResponse update(Integer id, AuthorRequest authorRequest) {
        Author author = findById(id);
        String oldName = author.getName() != null ? author.getName().trim() : "";
        String newName = authorRequest.getName() != null ? authorRequest.getName().trim() : oldName;

        author.setName(TextUtils.capitalizeFully(newName));
        if (!oldName.equalsIgnoreCase(newName)) {
            validate(authorRequest);
        }
        author.setWikibaseItem(authorRequest.getWikibaseItem());
        author.setSlug(TextUtils.toSlug(authorRequest.getName()));
        author.setUrlBio(authorRequest.getUrlBio());
        author.setUrlImage(authorRequest.getUrlImage());
        author.setDescription(authorRequest.getExtract());
        author.setStatus(authorRequest.getStatus() != null ? authorRequest.getStatus() : BaseStatus.ACTIVE);
        return authorMapper.toDTO(save(author));
    }

    @Override
    public void delete(Integer id) {
        Author author = findById(id);
        author.setStatus(BaseStatus.DELETED);
        save(author);
    }

    @Override
    public PageResponse<AuthorResponse> search(AuthorFilterRequest request) {
        int page = (request.getPage() == null || request.getPage() < 1) ? 0 : request.getPage() - 1;
        int size = (request.getSize() == null || request.getSize() < 1) ? 10 : request.getSize();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        BaseStatus baseStatus = BaseStatus.from(request.getStatus());
        String keyword = (request.getKeyword() == null) ? "" : request.getKeyword().trim();
        Page<Author> authorPage = authorRepository.findByNameContainingIgnoreCase(keyword, baseStatus, pageable);

        List<AuthorResponse> items = authorPage.getContent().stream().map(authorMapper::toDTO).toList();

        return new PageResponse<>(
                items,
                authorPage.getNumber(),
                authorPage.getSize(),
                authorPage.getTotalElements(),
                authorPage.getTotalPages());
    }

    @Override
    public Author save(Author author) {
        return authorRepository.save(author);
    }

    @Override
    public boolean existsByName(String name) {
        return authorRepository.existsByName(name);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return authorRepository.existsBySlug(slug);
    }

    @Override
    public void validate(AuthorRequest authorRequest) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (existsByName(authorRequest.getName())) {
            errors.addError("name", "Tên tác giả đã tồn tại.");
            log.warn("Kiểm tra trùng lặp: Tên tác giả [{}] đã tồn tại trong hệ thống.", authorRequest.getName());
        }
        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
        log.info("Kiểm tra trùng lặp hợp lệ: Tên tác giả [{}] sạch, có thể tạo mới.", authorRequest.getName());

    }

    @Override
    public void insertData() {
        if (authorRepository.count() > 0) {
            return;
        }
        // Danh sách tên các tác giả cần lấy thông tin
        List<String> authorNames = List.of(
                // Tác giả Việt Nam
                "Nguyễn Nhật Ánh",
                "Nam Cao",
                "Tô Hoài",
                "Nguyễn Du",
                "Vũ Trọng Phụng",
                "Thạch Lam",
                "Nguyễn Huy Thiệp",
                "Nguyễn Tuân",
                "Xuân Diệu",
                "Huy Cận",

                // Tác giả quốc tế
                "William Shakespeare", // Anh
                "Leo Tolstoy", // Nga
                "Fyodor Dostoevsky", // Nga
                "Gabriel García Márquez", // Colombia
                "Ernest Hemingway", // Mỹ
                "Haruki Murakami", // Nhật Bản
                "Victor Hugo", // Pháp
                "Franz Kafka", // Séc
                "Mark Twain", // Mỹ
                "J.K. Rowling" // Anh
        );
        // Tạo danh sách Author bằng cách gọi Service cho từng tên
        List<Author> authors = authorNames.stream()
                .map(this::createAuthor)
                .collect(Collectors.toList());

        // Thêm trường hợp "Khác" nếu cần thiết
        Author other = new Author();
        other.setName("Khác");
        other.setSlug("khac");
        other.setDescription("Tác giả không xác định hoặc nhóm khác");
        other.setStatus(BaseStatus.ACTIVE);
        authors.add(other);

        authorRepository.saveAll(authors);
    }

    public Author createAuthor(String name) {
        Author a = new Author();
        a.setName(TextUtils.capitalizeFully(name));
        a.setSlug(TextUtils.toSlug(name));

        WikipediaResponse response = wikipediaService.fetchApiInforAuthor(name);
        if (response != null) {
            a.setWikibaseItem(response.getWikibaseItem());
            a.setUrlImage(response.getUrlImage());
            a.setUrlBio(response.getUrlBio());
            a.setDescription(response.getExtract());
        }

        a.setStatus(BaseStatus.ACTIVE);
        return a;
    }

    @Override
    public List<AuthorWithProductCountResponse> findActiveAuthorsWithProductCount() {
        return authorRepository.findActiveAuthorsWithProductCount();
    }
}
