package com.dev.backend.constant;

import java.time.Duration;

public enum JwtType {

    ACCESS(Duration.ofMinutes(15)),
    REFRESH(Duration.ofDays(7)),
    RESET_PASSWORD(Duration.ofMinutes(15)),
    VERIFY_EMAIL(Duration.ofMinutes(5));

    private final Duration duration;

    JwtType(Duration duration) {
        this.duration = duration;
    }

    public long getExpirationMillis() {
        return duration.toMillis();
    }
}