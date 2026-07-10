package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.publisher.PublisherFilterRequest;
import com.dev.backend.dto.publisher.PublisherRequest;
import com.dev.backend.dto.publisher.PublisherResponse;
import com.dev.backend.dto.publisher.PublisherWithProductCountResponse;
import com.dev.backend.entity.Publisher;
import com.dev.backend.response.PageResponse;

public interface PublisherService {
    void validate(PublisherRequest publisherRequest);

    List<PublisherResponse> findAll();

    void insertData();

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    Publisher save(Publisher publisher);

    Publisher findById(Integer id);

    PublisherResponse add(PublisherRequest publisherRequest);

    PublisherResponse update(Integer id, PublisherRequest publisherRequest);

    void delete(Integer id);

    PageResponse<PublisherResponse> search(PublisherFilterRequest request);

    List<PublisherWithProductCountResponse> findActivePublishersWithProductCount();

    
}
