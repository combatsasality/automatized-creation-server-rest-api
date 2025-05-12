package com.combatsasality.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class TableCreateDto {

    @NotBlank(message = "Ім'я таблиці не може бути пустим")
    private String tableName;

    @NotNull(message = "Список полів не може бути пустим")
    @Valid
    private List<Field> fields;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public void setFields(List<Field> fields) {
        this.fields = fields;
    }

    public List<Field> getFields() {
        return fields;
    }
}
