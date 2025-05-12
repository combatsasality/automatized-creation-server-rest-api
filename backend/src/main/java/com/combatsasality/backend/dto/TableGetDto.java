package com.combatsasality.backend.dto;

import com.combatsasality.backend.persistence.models.CreatedTable;

import java.util.List;

public class TableGetDto {

    private String tableName;
    private List<CreatedTable.Methods> methods;
    private String path;

    public TableGetDto(String tableName, List<CreatedTable.Methods> methods, String path) {
        this.tableName = tableName;
        this.methods = methods;
        this.path = path;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

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
