package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.entity.Author;
@Component
public class AuthorMapper {
    public AuthorResponse toDTO(Author author) {
        if (author == null) {
            return null;
        }
        AuthorResponse authorResponse = new AuthorResponse();
        authorResponse.setId(author.getId());
        authorResponse.setName(author.getName());
        authorResponse.setWikibaseItem(author.getWikibaseItem());

        authorResponse.setUrlImage(urlImage(author.getUrlImage(), author.getName()));
        authorResponse.setUrlBio(author.getUrlBio());
        authorResponse.setDescription(author.getDescription());
        authorResponse.setStatus(author.getStatus());
        return authorResponse;

    }

   public String urlImage(String image, String name) {
    if (image != null && !image.trim().isEmpty()) {
        return image;
    }
    
    String encodedName = (name != null) ? name.trim().replace(" ", "+") : "User";
    
    return "https://ui-avatars.com/api/?name=" + encodedName + "&background=random&color=fff&size=128";
}

}
