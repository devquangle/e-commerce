package com.dev.backend.resp;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseData<T> {
    private boolean success;
    private String message;
    /** Luôn có trong JSON kể cả khi null (client thống nhất với contract API). */
    @JsonInclude(JsonInclude.Include.ALWAYS)
    private T data;
    
    private Integer code;
    private String error;
    private String path;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

}