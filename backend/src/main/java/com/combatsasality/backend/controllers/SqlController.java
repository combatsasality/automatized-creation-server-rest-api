package com.combatsasality.backend.controllers;

import com.combatsasality.backend.authentication.JwtUtil;
import com.combatsasality.backend.dto.*;
import com.combatsasality.backend.persistence.models.CreatedTable;
import com.combatsasality.backend.persistence.models.User;
import com.combatsasality.backend.persistence.services.CreatedTableService;
import com.combatsasality.backend.persistence.services.UserService;
import com.combatsasality.backend.utils.ApiResponse;
import com.combatsasality.backend.utils.SqlHelper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/sql")
@Validated
public class SqlController {
    private final JwtUtil jwtUtil;
    private final SqlHelper sqlHelper;
    private final UserService userService;
    private final CreatedTableService createdTableService;

    @Autowired
    public SqlController(JwtUtil jwtUtil, SqlHelper sqlHelper, UserService userService, CreatedTableService createdTableService) {
        this.jwtUtil = jwtUtil;
        this.sqlHelper = sqlHelper;
        this.userService = userService;
        this.createdTableService = createdTableService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> get(Authentication authentication) {
        String username = authentication.getName();

        List<CreatedTable> tables = createdTableService.findByOwner(username);
        List<TableGetDto> dtoTables = new ArrayList<>();

        for (CreatedTable table : tables) {
            String tableName = table.getName().split("__")[0];
            dtoTables.add(
                    new TableGetDto(tableName, table.getAvailableMethods(), String.format(
                            "/%s/%s/%s", "custom", username, tableName
                    ))
            );
        }

        return ResponseEntity.ok(new ApiResponse("", dtoTables));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody @Valid TableCreateDto table, Authentication authentication) {
        List<Field> fields = table.getFields();

        CreatedTableDto result = sqlHelper.createTable(table, authentication.getName());

        if (result == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Таблиця вже існує"));
        }

        return ResponseEntity.ok(new ApiResponse("Таблица успішно створена", result));
    }

    @PutMapping
    public ResponseEntity<ApiResponse> change(@RequestBody @Valid TablePostDto postDto, Authentication authentication) {
        String username = authentication.getName();
        User user = this.userService.findByUsername(username);

        CreatedTable table = this.createdTableService.findByName(postDto.getTableName() + "__" + username);

        if (table == null || !table.getOwner().equals(user)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Таблиці не існує"));
        }

        table.setAvailableMethods(postDto.getMethods());

        this.createdTableService.save(table);


        return ResponseEntity.ok(new ApiResponse("Таблиця успішно змінена"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> delete(@RequestParam @Valid String name, Authentication authentication) {
        String username = authentication.getName();
        User user = this.userService.findByUsername(username);

        CreatedTable table = this.createdTableService.findByName(name + "__" + username);

        if (table == null || !table.getOwner().equals(user)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Таблиці не існує"));
        }

        this.createdTableService.delete(table);
        this.sqlHelper.deleteTable(table.getName());

        return ResponseEntity.ok(new ApiResponse("Таблиця успішно видалено"));
    }


}
