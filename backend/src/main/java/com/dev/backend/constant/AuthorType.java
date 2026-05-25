package com.dev.backend.constant;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum AuthorType {

    // === KHÁC ===
    OTHER("Khác", 1),

    // === VIỆT NAM ===
    TO_HOAI("Tô Hoài", 2),
    NAM_CAO("Nam Cao", 3),
    XUAN_DIEU("Xuân Diệu", 4),
    TRAN_DANG_KHOA("Trần Đăng Khoa", 5),
    NGUYEN_DU("Nguyễn Du", 6),
    NGUYEN_NHAT_ANH("Nguyễn Nhật Ánh", 7),
    BAO_NINH("Bảo Ninh", 8),

    // === NHẬT BẢN ===
    HARUKI_MURAKAMI("Haruki Murakami", 9),
    YASUNARI_KAWABATA("Yasunari Kawabata", 10),
    KEIGO_HIGASHINO("Keigo Higashino", 11),
    RYUNOSUKE_AKUTAGAWA("Ryunosuke Akutagawa", 12),

    // === ANH ===
    WILLIAM_SHAKESPEARE("William Shakespeare", 13),
    JK_ROWLING("J.K. Rowling", 14),
    AGATHA_CHRISTIE("Agatha Christie", 15),
    CONAN_DOYLE("Arthur Conan Doyle", 16),

    // === PHÁP ===
    VICTOR_HUGO("Victor Hugo", 17),
    SAINT_EXUPERY("Antoine de Saint-Exupéry", 18),
    ALEXANDRE_DUMAS("Alexandre Dumas", 19),

    // === MỸ ===
    ERNEST_HEMINGWAY("Ernest Hemingway", 20),
    MARK_TWAIN("Mark Twain", 21),
    STEPHEN_KING("Stephen King", 22),
    JACK_LONDON("Jack London", 23);

    private final String displayName;
    private final int id;

    AuthorType(String displayName, Integer id) {
        this.displayName = displayName;
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Integer getId() {
        return id;
    }

    // Cache để lookup nhanh
    private static final Map<Integer, AuthorType> ID_MAP =
            Arrays.stream(values())
                    .collect(Collectors.toMap(
                            AuthorType::getId,
                            Function.identity()
                    ));

    public static AuthorType fromId(Integer id) {
        return ID_MAP.getOrDefault(id, OTHER);
    }
}