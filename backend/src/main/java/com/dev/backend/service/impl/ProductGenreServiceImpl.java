package com.dev.backend.service.impl;

import org.springframework.stereotype.Service;

import com.dev.backend.repository.ProductGenreRepository;
import com.dev.backend.service.ProductGenreService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class ProductGenreServiceImpl implements ProductGenreService {
    
    private final ProductGenreRepository genreRepository;


    @Override
    public boolean existsByGenreId(Integer genreId) {
        return genreRepository.existsByGenreId(genreId);
    }
}
