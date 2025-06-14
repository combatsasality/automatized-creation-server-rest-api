package com.combatsasality.backend.persistence.exceptions;

public class BadValidationException extends RuntimeException {
    public BadValidationException(String message) {
        super(message);
    }
}
