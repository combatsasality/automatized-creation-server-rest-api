package com.combatsasality.backend.dto;

import com.combatsasality.backend.persistence.models.CreatedTable;

import java.util.List;

public class CreatedTableDto {

    private String name;
    private List<CreatedTable.Methods> availableMethods;

    public CreatedTableDto(String name, List<CreatedTable.Methods> availableMethods) {
        this.name = name.split("__")[0];
        this.availableMethods = availableMethods;
    }

    public CreatedTableDto() {

    }

    public CreatedTableDto(CreatedTable table) {
        this.name = table.getName().split("__")[0];
        this.availableMethods = table.getAvailableMethods();
    }

    public String getName() {
        return name;
    }

    public List<CreatedTable.Methods> getAvailableMethods() {
        return availableMethods;
    }
}
