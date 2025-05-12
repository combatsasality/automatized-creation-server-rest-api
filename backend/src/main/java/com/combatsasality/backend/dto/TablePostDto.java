package com.combatsasality.backend.dto;

import com.combatsasality.backend.persistence.models.CreatedTable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class TablePostDto {

    @NotBlank(message = "Ім'я таблиці не може бути пустим")
    private String tableName;

    @NotNull(message = "Список методів не може бути пустим")
    @Valid
    private List<CreatedTable.Methods> methods;

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public List<CreatedTable.Methods> getMethods() {
        return methods;
    }

    public void setMethods(List<CreatedTable.Methods> methods) {
        this.methods = methods;
    }
}
