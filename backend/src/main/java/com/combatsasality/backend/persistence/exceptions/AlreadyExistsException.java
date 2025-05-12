package com.combatsasality.backend.persistence.exceptions;

public class AlreadyExistsException extends RuntimeException {
    public AlreadyExistsException() {
        super("Object already exists");
    }
}
