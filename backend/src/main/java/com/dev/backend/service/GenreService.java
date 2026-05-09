package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.genre.GenreRequest;
import com.dev.backend.dto.genre.GenreResponse;
import com.dev.backend.entity.Genre;
import com.dev.backend.resp.PageResponse;

public interface GenreService {
    boolean isEmpty();
    List<GenreResponse> getAllGenre();
    Genre save(Genre genre);
    Genre findById(Integer id);
    Genre findByName(String name);
    void demoData();
    boolean validation(String name);

    Genre addGenre(GenreRequest genreRequest);

    PageResponse<GenreResponse> pageGenre(int page, int size, String keyword);
    
    
}
