package com.combatsasality.backend.controllers;

import com.combatsasality.backend.utils.ApiResponse;
import com.combatsasality.backend.utils.SqlHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/custom")
public class CustomController {

    private final SqlHelper sqlHelper;

    @Autowired
    public CustomController(SqlHelper sqlHelper) {
        this.sqlHelper = sqlHelper;
    }

    @GetMapping("/{username}/{tableName}")
    public ResponseEntity<ApiResponse> get(
            @PathVariable String username, @PathVariable String tableName
    ) {
        List<Map<String, Object>> data = sqlHelper.getRowsFromDynamicTable(
                String.format("%s__%s", tableName, username)
        );

        if (data.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse("api.tableEmpty"));
        }


        return ResponseEntity.ok(new ApiResponse("", data));
    }

    @PostMapping("/{username}/{tableName}")
    public ResponseEntity<ApiResponse> insert(
            @PathVariable String username,
            @PathVariable String tableName,
            @RequestBody Map<String, Object> body
    ) {
        String fullTableName = String.format("%s__%s", tableName, username);

        try {
            sqlHelper.insertRowIntoDynamicTable(fullTableName, body);
            return ResponseEntity.ok(new ApiResponse("api.rowAdded"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Error " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Unknown error: " + e.getMessage()));
        }
    }

    @PostMapping("/{username}/{tableName}/delete")
    public ResponseEntity<ApiResponse> delete(
            @PathVariable String username,
            @PathVariable String tableName,
            @RequestBody Map<String, Object> conditions
    ) {
        String fullTableName = String.format("%s__%s", tableName, username);

        try {
            sqlHelper.deleteRowFromDynamicTable(fullTableName, conditions);
            return ResponseEntity.ok(new ApiResponse("api.rowDeleted"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Unknown error: " + e.getMessage()));
        }
    }


}
