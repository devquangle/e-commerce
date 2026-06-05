package com.dev.backend.util;

public class Capitalize {
    public static String capitalizeFully(String input) {
    if (input == null || input.isEmpty()) {
        return input;
    }

    // Tách chuỗi thành mảng các từ dựa vào khoảng trắng
    String[] words = input.trim().split("\\s+");
    StringBuilder result = new StringBuilder();

    for (String word : words) {
        if (!word.isEmpty()) {
            // Viết hoa chữ đầu của từ, viết thường các chữ sau
            result.append(word.substring(0, 1).toUpperCase())
                  .append(word.substring(1).toLowerCase())
                  .append(" "); // Thêm khoảng trắng giữa các từ
        }
    }

    // Trả về chuỗi đã cắt bỏ khoảng trắng thừa ở cuối
    return result.toString().trim();
}
}
