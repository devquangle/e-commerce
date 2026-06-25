package com.dev.backend.util;

import com.neovisionaries.i18n.LanguageCode;

public class LanguageHelper {
    public static String getLanguageName(String langCode) {
        if (langCode == null || langCode.trim().isEmpty()) {
            return "Unknown";
        }

        // Try common lookup methods for neovisionaries LanguageCode
        LanguageCode lc = null;
        try {
            // prefer getByCode (accepts ISO 639-1 alpha2 codes)
            lc = LanguageCode.getByCode(langCode.trim());
        } catch (NoSuchMethodError | UnsupportedOperationException e) {
            // fallback: iterate and match alpha2 code
        }

        if (lc == null) {
            for (LanguageCode c : LanguageCode.values()) {
                if (langCode.equalsIgnoreCase(c.getAlpha3().toString()) || langCode.equalsIgnoreCase(c.toString())) {
                    lc = c;
                    break;
                }
            }
        }

        if (lc != null) {
            return lc.getName();
        }
        return "Unknown";
    }
}
