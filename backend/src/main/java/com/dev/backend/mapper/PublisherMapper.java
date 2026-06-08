package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.publisher.PublisherResponse;
import com.dev.backend.entity.Publisher;
@Component
public class PublisherMapper {
    public  PublisherResponse toDTO(Publisher publisher) {
        if (publisher == null) {
            return null;
        }
        return PublisherResponse.builder()
                .id(publisher.getId())
                .name(publisher.getName())
                .slug(publisher.getSlug())
                .status(publisher.getStatus())
                .street(publisher.getStreet())
                .build();

    }

}
