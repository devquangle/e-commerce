package com.dev.backend.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.dto.author.AuthorRequest;
import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.dto.author.AuthorWithProductCountResponse;
import com.dev.backend.entity.Author;
import com.dev.backend.exception.DuplicateFieldException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.AuthorMapper;
import com.dev.backend.repository.AuthorRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.AuthorService;
import com.dev.backend.util.TextUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

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
    public PageResponse<AuthorResponse> pages(int page, int size, String keyword, String status) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id"));

        BaseStatus baseStatus = (status == null || status.isBlank())
                ? null
                : BaseStatus.valueOf(status);

        Page<Author> authorPage = authorRepository
                .findByNameContainingIgnoreCase(keyword == null ? "" : keyword, baseStatus, pageable);

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

        List<Author> authors = List.of(
                createAuthor(
                        "Khác",
                        null,
                        null,
                        null,
                        "Tác giả không xác định hoặc nhóm khác"),

                createAuthor(
                        "Nguyễn Nhật Ánh",
                        "Q7022893",
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Nguyen_Nhat_Anh_in_January_2019.png/330px-Nguyen_Nhat_Anh_in_January_2019.png",
                        "https://vi.wikipedia.org/wiki/Nguy%E1%BB%85n_Nh%E1%BA%ADt_%C3%81nh",
                        "Nguyễn Nhật Ánh là nhà văn Việt Nam nổi tiếng..."),

                createAuthor(
                        "Nam Cao",
                        "Q11760",
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Portrait_of_Nam_Cao.jpg/330px-Portrait_of_Nam_Cao.jpg",
                        "https://vi.wikipedia.org/wiki/Nam_Cao",
                        "Nam Cao là một nhà văn..."),

                createAuthor(
                        "Tô Hoài",
                        "Q13127",
                        "https://upload.wikimedia.org/wikipedia/vi/thumb/7/73/Nhavan_t%C3%B4_ho%C3%A0i.jpg/330px-Nhavan_t%C3%B4_ho%C3%A0i.jpg",
                        "https://vi.wikipedia.org/wiki/T%C3%B4_Ho%C3%A0i",
                        "Tô Hoài là một nhà văn..."));
        if (authorRepository.count() == 0) {
            authorRepository.saveAll(authors);
        }

    }

    public Author createAuthor(
            String name,
            String wikibaseItem,
            String image,
            String urlBio,
            String description) {
        Author a = new Author();
        a.setName(name);
        a.setSlug(TextUtils.toSlug(name));
        a.setWikibaseItem(wikibaseItem);
        a.setUrlImage(image);
        a.setUrlBio(urlBio);
        a.setDescription(description);
        a.setStatus(BaseStatus.ACTIVE);
        return a;
    }


    @Override
    public List<AuthorWithProductCountResponse> findActiveAuthorsWithProductCount() {
        return authorRepository.findActiveAuthorsWithProductCount();
    }
}
