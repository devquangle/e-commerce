package com.dev.backend.utils;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GenerateCode {

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGIT = "0123456789";
    private static final String SPECIAL = "!@#$%^&*-";

    private static final String ALL = UPPER + LOWER + DIGIT + SPECIAL;

    private static final SecureRandom random = new SecureRandom();

    public static String generateCode(int length) {

        List<Character> chars = new ArrayList<>();

        chars.add(UPPER.charAt(random.nextInt(UPPER.length())));
        chars.add(LOWER.charAt(random.nextInt(LOWER.length())));
        chars.add(DIGIT.charAt(random.nextInt(DIGIT.length())));
        chars.add(SPECIAL.charAt(random.nextInt(SPECIAL.length())));

        for (int i = 4; i < length; i++) {
            chars.add(ALL.charAt(random.nextInt(ALL.length())));
        }

        Collections.shuffle(chars);

        StringBuilder code = new StringBuilder();
        for (char c : chars) {
            code.append(c);
        }

        return code.toString();
    }

}