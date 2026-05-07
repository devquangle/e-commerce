package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.constant.GenreStatus;
import com.dev.backend.dto.genre.GenreRequest;
import com.dev.backend.dto.genre.GenreResponse;
import com.dev.backend.entity.Genre;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.GenreMapper;
import com.dev.backend.repository.GenreRepository;
import com.dev.backend.service.GenreService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {
        private final GenreRepository genreRepository;
        private final GenreMapper genreMapper;

        @Override
        public boolean isEmpty() {
                return genreRepository.count() == 0;
        }

        @Override
        public List<GenreResponse> getAllGenre() {
                List<Genre> genres = genreRepository.findAll();
                return genres.stream().map(genreMapper::toDTO).toList();
        }

        @Override
        public Genre save(Genre genre) {
                return genreRepository.save(genre);
        }

        @Override
        public void demoData() {

                if (genreRepository.count() > 0) {
                        return;
                }

                /* ================= PARENT ================= */

                Genre novel = Genre.builder()
                                .name("Tiểu thuyết")
                                .status(GenreStatus.ACTIVE)
                                .build();

                Genre manga = Genre.builder()
                                .name("Manga")
                                .status(GenreStatus.ACTIVE)
                                .build();

                Genre economy = Genre.builder()
                                .name("Kinh tế")
                                .status(GenreStatus.ACTIVE)
                                .build();

                genreRepository.saveAll(List.of(
                                novel,
                                manga,
                                economy));

        }

        @Override
        public boolean validation(String name) {
                // TODO Auto-generated method stub
                return false;
        }

        @Override
        public Genre addGenre(GenreRequest genreRequest) {
                Genre genre = new Genre();
                genre.setName(genreRequest.getName());
                genre.setStatus(genreRequest.getStatus());

                return save(genre);
        }

        @Override
        public Genre findById(Integer id) {
                return genreRepository.findById(id).orElseThrow(() -> new NotFoundException("NOT FOUND"));
        }

        @Override
        public Genre findByName(String name) {
                // TODO Auto-generated method stub
                return null;
        }
}
