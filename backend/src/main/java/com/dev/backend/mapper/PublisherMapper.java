package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.publisher.ProductPublisherResponse;
import com.dev.backend.dto.publisher.PublisherResponse;
import com.dev.backend.entity.Publisher;

@Component
public class PublisherMapper {
    public PublisherResponse toDTO(Publisher publisher) {
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

    public ProductPublisherResponse toProductPublisher(Publisher publisher) {
        if (publisher == null) {
            return null;
        }

        ProductPublisherResponse dto = new ProductPublisherResponse();
        dto.setId(publisher.getId());
        dto.setName(publisher.getName());
        dto.setSlug(publisher.getSlug());

        return dto;
    }

}
