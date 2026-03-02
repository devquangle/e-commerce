package com.dev.backend.resp;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseData {
    private boolean success;
    private String message;
    private Object data;
    private LocalDateTime timestamp= LocalDateTime.now();
    
}
