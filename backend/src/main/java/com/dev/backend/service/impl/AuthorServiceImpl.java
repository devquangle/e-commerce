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
        author.setName(authorRequest.getName());
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

        authorRequest.setName(newName);
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
        }
        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }

    }

    @Override
    public void insertData() {

        List<Author> authors = List.of(

                new Author(
                        null,
                        "Khác",
                        TextUtils.toSlug("Khác"),
                        null,
                        null,
                        null,
                        "Tác giả không xác định hoặc nhóm khác",
                        BaseStatus.ACTIVE),

                new Author(
                        null,
                        "Nguyễn Nhật Ánh",
                        TextUtils.toSlug("Nguyễn Nhật Ánh"),
                        "Q7022893",
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Nguyen_Nhat_Anh_in_January_2019.png/330px-Nguyen_Nhat_Anh_in_January_2019.png",
                        "https://vi.wikipedia.org/wiki/Nguy%E1%BB%85n_Nh%E1%BA%ADt_%C3%81nh",
                        "Nguyễn Nhật Ánh là nhà văn Việt Nam nổi tiếng với các tác phẩm về tuổi thơ và thanh thiếu niên.",
                        BaseStatus.ACTIVE),

                new Author(
                        null,
                        "Nam Cao",
                        TextUtils.toSlug("Nam Cao"),
                        "Q11760",
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Portrait_of_Nam_Cao.jpg/330px-Portrait_of_Nam_Cao.jpg",
                        "https://vi.wikipedia.org/wiki/Nam_Cao",
                        "Nam Cao là một nhà văn, nhà báo và cũng là một chiến sĩ, liệt sĩ, Anh hùng Lực lượng vũ trang nhân dân Việt Nam. Ông là nhà văn hiện thực lớn trước Cách mạng Tháng Tám, một nhà báo kháng chiến sau khi Cách mạng thành công và là một trong những nhà văn người Việt Nam tiêu biểu nhất thế kỷ 20. Nam Cao có nhiều đóng góp quan trọng đối với việc hoàn thiện phong cách truyện ngắn và tiểu thuyết Việt Nam ở nửa đầu thế kỷ 20.",
                        BaseStatus.ACTIVE),

                new Author(
                        null,
                        "Tô Hoài",
                        TextUtils.toSlug("Tô Hoài"),
                        "Q13127",
                        "https://upload.wikimedia.org/wikipedia/vi/thumb/7/73/Nhavan_t%C3%B4_ho%C3%A0i.jpg/330px-Nhavan_t%C3%B4_ho%C3%A0i.jpg",
                        "https://vi.wikipedia.org/wiki/T%C3%B4_Ho%C3%A0i",
                        "Tô Hoài là một nhà văn Việt Nam được tặng Giải thưởng Hồ Chí Minh về Văn học Nghệ thuật năm 1996. Ông là Tổng Thư ký đầu tiên của Hội Nhà văn Việt Nam (1957-1963). Dế Mèn phiêu lưu ký là tác phẩm được nhiều người biết đến nhất của ông dành cho thiếu nhi.",
                        BaseStatus.ACTIVE)

        );
        if (authorRepository.count() == 0) {
            authorRepository.saveAll(authors);
        }

    }
}
