package com.combatsasality.backend.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HelpHandler {

    public static String hashString(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] encodedHash = digest.digest(input.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedHash) {
                hexString.append(String.format("%02x", b));
            }

            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            // Если алгоритм не найден, выбрасываем исключение
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }


}
