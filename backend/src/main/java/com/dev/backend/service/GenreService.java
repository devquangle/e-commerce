package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.genre.GenreRequest;
import com.dev.backend.dto.genre.GenreResponse;
import com.dev.backend.entity.Genre;

public interface GenreService {
    boolean isEmpty();
    List<GenreResponse> getAllGenre();
    Genre save(Genre genre);
    Genre findById(Integer id);
    Genre findByName(String name);
    void demoData();
    boolean validation(String name);

    Genre addGenre(GenreRequest genreRequest);
    
}
