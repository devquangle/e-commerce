package com.dev.backend.util;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public final class LanguageHelper {

    private LanguageHelper() {
    }

    private static final Map<String, String> LANGUAGE_MAP;

    static {
        Map<String, String> map = new HashMap<>();

        map.put("af", "Tiếng Afrikaans");
        map.put("ar", "Tiếng Ả Rập");
        map.put("bg", "Tiếng Bulgaria");
        map.put("bn", "Tiếng Bengal");
        map.put("ca", "Tiếng Catalan");
        map.put("cs", "Tiếng Séc");
        map.put("da", "Tiếng Đan Mạch");
        map.put("de", "Tiếng Đức");
        map.put("el", "Tiếng Hy Lạp");
        map.put("en", "Tiếng Anh");
        map.put("es", "Tiếng Tây Ban Nha");
        map.put("et", "Tiếng Estonia");
        map.put("fa", "Tiếng Ba Tư");
        map.put("fi", "Tiếng Phần Lan");
        map.put("fr", "Tiếng Pháp");
        map.put("he", "Tiếng Do Thái");
        map.put("hi", "Tiếng Hindi");
        map.put("hr", "Tiếng Croatia");
        map.put("hu", "Tiếng Hungary");
        map.put("id", "Tiếng Indonesia");
        map.put("it", "Tiếng Ý");
        map.put("ja", "Tiếng Nhật");
        map.put("ko", "Tiếng Hàn");
        map.put("lt", "Tiếng Litva");
        map.put("lv", "Tiếng Latvia");
        map.put("ms", "Tiếng Mã Lai");
        map.put("nl", "Tiếng Hà Lan");
        map.put("no", "Tiếng Na Uy");
        map.put("pl", "Tiếng Ba Lan");
        map.put("pt", "Tiếng Bồ Đào Nha");
        map.put("ro", "Tiếng Romania");
        map.put("ru", "Tiếng Nga");
        map.put("sk", "Tiếng Slovakia");
        map.put("sl", "Tiếng Slovenia");
        map.put("sr", "Tiếng Serbia");
        map.put("sv", "Tiếng Thụy Điển");
        map.put("ta", "Tiếng Tamil");
        map.put("th", "Tiếng Thái");
        map.put("tr", "Tiếng Thổ Nhĩ Kỳ");
        map.put("uk", "Tiếng Ukraina");
        map.put("ur", "Tiếng Urdu");
        map.put("vi", "Tiếng Việt");
        map.put("zh", "Tiếng Trung");

        LANGUAGE_MAP = Collections.unmodifiableMap(map);
    }

    public static String getDisplayName(String code) {
        if (code == null || code.isBlank()) {
            return "Không xác định";
        }

        return LANGUAGE_MAP.getOrDefault(code.toLowerCase(), code);
    }

    public static Map<String, String> getAll() {
        return LANGUAGE_MAP;
    }
}