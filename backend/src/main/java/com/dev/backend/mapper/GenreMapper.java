package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.genre.GenreResponse;
import com.dev.backend.entity.Genre;

@Component
public class GenreMapper {
  
  public GenreResponse toDTO(Genre genre){
    if (genre==null) {
        return null;
    }
    GenreResponse dto = new GenreResponse();
    dto.setId(genre.getId());
    dto.setName(genre.getName());
    dto.setStatus(genre.getStatus());
    if (genre.getProductGenres()==null) {
          dto.setTotalProduct(0);
    }else{
        dto.setTotalProduct(genre.getProductGenres().size());
    }
    return dto;
  }
}
