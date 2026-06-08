package com.dev.backend.dto.publisher;

import com.dev.backend.constant.BaseStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class PublisherRequest {
    private String name;
    private String street;
    private BaseStatus status;
}
