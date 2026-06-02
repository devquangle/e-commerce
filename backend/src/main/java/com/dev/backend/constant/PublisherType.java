package com.dev.backend.constant;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum PublisherType {

    // === KHÁC ===
    OTHER("Khác", 1),

    // === VIỆT NAM ===
    KIM_DONG("NXB Kim Đồng", 2),
    TRE("NXB Trẻ", 3),
    GIAO_DUC("NXB Giáo Dục", 4),
    HOI_NHA_VAN("NXB Hội Nhà Văn", 5),
    VAN_HOC("NXB Văn Học", 6),
    LAO_DONG("NXB Lao Động", 7),
    THANH_NIEN("NXB Thanh Niên", 8),
    TONG_HOP_TPHCM("NXB Tổng Hợp TP.HCM", 9),
    PHU_NU("NXB Phụ Nữ", 10),
    CHINH_TRI_QUOC_GIA("NXB Chính Trị Quốc Gia", 11),

    // === QUỐC TẾ ===
    PENGUIN_RANDOM_HOUSE("Penguin Random House", 12),
    HARPERCOLLINS("HarperCollins", 13),
    SIMON_SCHUSTER("Simon & Schuster", 14),
    MACMILLAN("Macmillan Publishers", 15),
    HACHETTE("Hachette Livre", 16),
    SCHOLASTIC("Scholastic", 17),
    OXFORD_PRESS("Oxford University Press", 18),
    CAMBRIDGE_PRESS("Cambridge University Press", 19),
    SHUEISHA("Shueisha", 20),
    KODANSHA("Kodansha", 21);

    private final String displayName;
    private final int id;

    PublisherType(String displayName, int id) {
        this.displayName = displayName;
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getId() {
        return id;
    }

    private static final Map<Integer, PublisherType> ID_MAP = Arrays.stream(values())
            .collect(Collectors.toMap(
                    PublisherType::getId,
                    Function.identity()));

    public static PublisherType fromId(Integer id) {
        return ID_MAP.getOrDefault(id, OTHER);
    }
}