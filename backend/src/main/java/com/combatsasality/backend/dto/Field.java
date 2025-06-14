package com.combatsasality.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class Field {

    @NotBlank(message="Ім'я рядку не може бути пустим")
    private String name;
    @NotNull(message="Тип рядку не може бути пустим")
    private Type type;
    private boolean isCanBeNull = true;
    private boolean isUnique = false;


    public Field() {}

    public Field(String name, Type type) {
        this.name = name;
        this.type = type;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public boolean isCanBeNull() {
        return isCanBeNull;
    }

    public void setCanBeNull(boolean canBeNull) {
        isCanBeNull = canBeNull;
    }

    public boolean isUnique() {
        return isUnique;
    }

    public void setUnique(boolean unique) {
        isUnique = unique;
    }

    


//




    
    public enum Type {
        TEXT,
        BOOLEAN,
        INT,
        NUMERIC,
    }
}
