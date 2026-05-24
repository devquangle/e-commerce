package com.dev.backend.constant;

public enum AuthorType {

    // === VIỆT NAM ===
    TO_HOAI("Tô Hoài", 1),
    NAM_CAO("Nam Cao", 2),
    XUAN_DIEU("Xuân Diệu", 3),
    TRAN_DANG_KHOA("Trần Đăng Khoa", 4),
    NGUYEN_DU("Nguyễn Du", 5),
    NGUYEN_NHAT_ANH("Nguyễn Nhật Ánh", 6),
    BAO_NINH("Bảo Ninh", 7),

    // === NHẬT BẢN ===
    HARUKI_MURAKAMI("Haruki Murakami", 8),
    YASUNARI_KAWABATA("Yasunari Kawabata", 9),
    KEIGO_HIGASHINO("Keigo Higashino", 10),
    RYUNOSUKE_AKUTAGAWA("Ryunosuke Akutagawa", 11),

    // === ANH ===
    WILLIAM_SHAKESPEARE("William Shakespeare", 12),
    JK_ROWLING("J.K. Rowling", 13),
    AGATHA_CHRISTIE("Agatha Christie", 14),
    CONAN_DOYLE("Arthur Conan Doyle", 15),

    // === PHÁP ===
    VICTOR_HUGO("Victor Hugo", 16),
    SAINT_EXUPERY("Antoine de Saint-Exupéry", 17),
    ALEXANDRE_DUMAS("Alexandre Dumas", 18),

    // === MỸ ===
    ERNEST_HEMINGWAY("Ernest Hemingway", 19),
    MARK_TWAIN("Mark Twain", 20),
    STEPHEN_KING("Stephen King", 21),
    JACK_LONDON("Jack London", 22),

    // === KHÁC ===
    OTHER("Khác", 23);

    private final String displayName;
    private final Integer id;

    // Sửa lỗi chính tả tham số truyền vào và gán giá trị chính xác
    AuthorType(String displayName, Integer id) {
        this.displayName = displayName;
        this.id = id;
    }

    // Getter để lấy tên hiển thị
    public String getDisplayName() {
        return displayName;
    }

    // Bổ sung Getter để lấy ID của tác giả
    public Integer getId() {
        return id;
    }
}