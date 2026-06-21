package com.dev.backend.service.impl;

import java.util.HashMap;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.dto.genre.GenreRequest;
import com.dev.backend.dto.genre.GenreResponse;
import com.dev.backend.dto.genre.GenreWithProductCountResponse;
import com.dev.backend.entity.Genre;
import com.dev.backend.exception.DuplicateFieldException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.GenreMapper;
import com.dev.backend.repository.GenreRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.CloudinaryService;

import com.dev.backend.service.GenreService;
import com.dev.backend.service.ProductGenreService;
import com.dev.backend.util.TextUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {
        private final GenreRepository genreRepository;
        private final GenreMapper genreMapper;
        private final ProductGenreService productGenreService;
        private final CloudinaryService cloudinaryService;

        @Override
        public boolean isEmpty() {
                return genreRepository.count() == 0;
        }

        @Override
        public List<GenreResponse> findAll() {
                List<Genre> genres = genreRepository.findAll();
                return genres.stream().map(genreMapper::toDTO).toList();
        }

        @Override
        public Genre save(Genre genre) {
                return genreRepository.save(genre);
        }

        @Override
        public void insertData() {

                if (genreRepository.count() > 0) {
                        return;
                }

                /* ================= PARENT ================= */

                Genre novel = Genre.builder()
                                .name("Tiểu thuyết")
                                .status(BaseStatus.ACTIVE)
                                .build();

                Genre manga = Genre.builder()
                                .name("Manga")
                                .status(BaseStatus.ACTIVE)
                                .build();

                Genre economy = Genre.builder()
                                .name("Kinh tế")
                                .status(BaseStatus.ACTIVE)
                                .build();

                genreRepository.saveAll(List.of(
                                novel,
                                manga,
                                economy));

        }

        @Override
        public boolean existsByName(String name) {
                return genreRepository.existsByName(name);
        }

        @Override
        public void validate(String name) {
                DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
                if (existsByName(name)) {
                        errors.addError("name", "Tên thể loại đã tồn tại");
                }
                if (!errors.getErrors().isEmpty()) {
                        throw errors;
                }
        }

        @Override
        public GenreResponse addGenre(GenreRequest genreRequest) {
                Genre genre = new Genre();
                validate(genreRequest.getName());
                genre.setName(genreRequest.getName());
                genre.setStatus(genreRequest.getStatus());
                genre.setSlug(TextUtils.toSlug(genreRequest.getName()));
                genre.setUrlImage(genreRequest.getPreviewImageUrl());

                return genreMapper.toDTO(save(genre));
        }

        @Override
        public GenreResponse updateGenre(Integer id, GenreRequest genreRequest) {
                Genre genre = findById(id);
                if (!genre.getName().equals(genreRequest.getName())) {
                        validate(genreRequest.getName());
                }
                genre.setName(genreRequest.getName());
                genre.setStatus(genreRequest.getStatus());
                genre.setUrlImage(genreRequest.getPreviewImageUrl());

                return genreMapper.toDTO(save(genre));
        }

        @Override
        public void setImageCloudinary(
                        Genre genre,
                        MultipartFile image) {

                if (image == null || image.isEmpty()) {
                        return;
                }

                String contentType = image.getContentType();

                if (contentType == null ||
                                !contentType.startsWith("image/")) {

                        throw new RuntimeException(
                                        "File không phải ảnh");
                }

                String imageUrl = cloudinaryService
                                .uploadImage(image);

                genre.setUrlImage(imageUrl);

        }

        @Override
        public Genre findById(Integer id) {
                return genreRepository.findById(id).orElseThrow(() -> new NotFoundException("NOT FOUND"));
        }

        @Override
        public Genre findByName(String name) {
                return null;
        }

        @Override
        public void delete(Integer id) {
                Genre genre = findById(id);
                boolean hasProducts = productGenreService.existsByGenreId(id);
                if (hasProducts) {
                        genre.setStatus(BaseStatus.DELETED);
                        save(genre);
                        return;
                }
                genreRepository.delete(genre);

        }

        @Override
        public PageResponse<GenreResponse> pageGenre(
                        int page,
                        int size,
                        String keyword,
                        String status) {
                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by(Sort.Direction.DESC, "id"));

                BaseStatus baseStatus = null;

                if (status != null && !status.isBlank()) {
                        baseStatus = BaseStatus.valueOf(status);
                }

                Page<Genre> genrePage = genreRepository.filterGenres(
                                keyword,
                                baseStatus,
                                pageable);

                List<GenreResponse> items = genrePage.getContent()
                                .stream()
                                .map(genreMapper::toDTO)
                                .toList();

                return new PageResponse<>(
                                items,
                                genrePage.getNumber(),
                                genrePage.getSize(),
                                genrePage.getTotalElements(),
                                genrePage.getTotalPages());
        }

        @Override
        public List<GenreWithProductCountResponse> findActiveGenresWithProductCount() {
                return genreRepository.findActiveGenresWithProductCount();
        }

        @Override
        public List<Genre> saveAll(List<Genre> list) {
                return genreRepository.saveAll(list);
        }
}
