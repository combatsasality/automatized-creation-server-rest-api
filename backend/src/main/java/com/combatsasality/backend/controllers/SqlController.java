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

    @GetMapping("/name")
    public ResponseEntity<ApiResponse> get(@RequestParam String tableName, Authentication authentication) {
        String username = authentication.getName();

        CreatedTable table = createdTableService.findByName(tableName + "__" + username);

        if (table == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("api.tableNotExists"));
        }

        return ResponseEntity.ok(new ApiResponse("", table));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> create(@RequestBody @Valid TableCreateDto table, Authentication authentication) {


        CreatedTableDto result = sqlHelper.createTable(table, authentication.getName());

        if (result == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("api.tableExists"));
        }

        return ResponseEntity.ok(new ApiResponse("api.createdTable", result));
    }

    @PutMapping
    public ResponseEntity<ApiResponse> change(@RequestBody @Valid TablePostDto postDto, Authentication authentication) {
        String username = authentication.getName();
        User user = this.userService.findByUsername(username);

        CreatedTable table = this.createdTableService.findByName(postDto.getTableName() + "__" + username);

        if (table == null || !table.getOwner().equals(user)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("api.tableNotExists"));
        }

        table.setAvailableMethods(postDto.getMethods());

        this.createdTableService.save(table);


        return ResponseEntity.ok(new ApiResponse("api.tableEdited"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> delete(@RequestBody @Valid List<String> names, Authentication authentication) {
        String username = authentication.getName();
        User user = this.userService.findByUsername(username);

        List<String> failedDeletes = new ArrayList<>();
        List<String> deletedTables = new ArrayList<>();

        for (String name : names) {
            CreatedTable table = this.createdTableService.findByName(name + "__" + username);

            if (table == null || !table.getOwner().equals(user)) {
                failedDeletes.add(name);
                continue;
            }

            this.createdTableService.delete(table);
            this.sqlHelper.deleteTable(table.getName());
            deletedTables.add(name);
        }

        if (!failedDeletes.isEmpty()) {
            String message = "Can't delete tables: " + String.join(", ", failedDeletes);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(message));
        }

        String successMessage = "Deleted tables: " + String.join(", ", deletedTables);
        return ResponseEntity.ok(new ApiResponse(successMessage));
    }


}
