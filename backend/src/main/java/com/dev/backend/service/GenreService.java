package com.dev.backend.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.dto.genre.GenreRequest;
import com.dev.backend.dto.genre.GenreResponse;
import com.dev.backend.dto.genre.GenreWithProductCountResponse;
import com.dev.backend.dto.genre.UserGenreResponse;
import com.dev.backend.entity.Genre;
import com.dev.backend.response.PageResponse;

public interface GenreService {
    boolean isEmpty();

    List<GenreResponse> findAll();

    Genre save(Genre genre);

    List<Genre> saveAll( List<Genre> list);


    Genre findById(Integer id);

    Genre findByName(String name);

    void insertData();

    GenreResponse addGenre(GenreRequest genreRequest);

    GenreResponse updateGenre(Integer id, GenreRequest genreRequest);

    PageResponse<GenreResponse> pageGenre(int page, int size, String keyword,String status);

    boolean existsByName(String name);

    void validate(String name);

    void setImageCloudinary(Genre genre, MultipartFile image);

    void delete(Integer id);

    List<GenreWithProductCountResponse> findActiveGenresWithProductCount();

}
