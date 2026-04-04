package com.dev.backend.resp;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Envelope API thống nhất (đồng bộ với frontend: types/response-data.ts).
 * <p>{@code data} luôn có trong JSON kể cả null. {@code code}, {@code error}, {@code path}
 * thường dùng cho lỗi; giá trị {@code error} chuẩn xem {@link ApiErrorCode}.
 * Phản hồi thành công qua {@link ResponseUtil} có thể không gửi các trường đó.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseData<T> {
    private boolean success;
    private String message;
    @JsonInclude(JsonInclude.Include.ALWAYS)
    private T data;

    private Integer code;
    private String error;
    private String path;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

}