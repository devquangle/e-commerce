package com.dev.backend.mapper;

import com.dev.backend.constant.PublisherType;
import com.dev.backend.dto.publisher.PublisherResponse;

public class PublisherMapper {
    public static PublisherResponse toDTO(PublisherType publisherType) {
        if (publisherType == null) {
            return null;
        }
        return new PublisherResponse(
                publisherType.getId(),
                publisherType.name(),
                publisherType.getDisplayName()
        );
    }

}
