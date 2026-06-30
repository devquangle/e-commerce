package com.dev.backend.util;

import java.time.LocalDate;

import com.dev.backend.exception.BadRequestException;

public class FilterValidator {
    public static String normalizeKeyword(String keyword) {
        return keyword == null ? "" : keyword.trim();
    }

 

    public static void validateDateRange(
            LocalDate startDate,
            LocalDate endDate,
            String startName,
            String endName) {

        if (startDate != null
                && endDate != null
                && startDate.isAfter(endDate)) {
            throw new BadRequestException(
                    startName + " phải trước hoặc bằng " + endName + ".");
        }
    }

    public static <E extends Enum<E>> E parseEnum(
            String value,
            Class<E> enumClass,
            String fieldName) {

        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return Enum.valueOf(enumClass, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(fieldName + " không hợp lệ.");
        }
    }
}
