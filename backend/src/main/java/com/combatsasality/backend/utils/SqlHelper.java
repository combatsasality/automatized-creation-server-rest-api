package com.combatsasality.backend.utils;

import com.combatsasality.backend.dto.CreatedTableDto;
import com.combatsasality.backend.dto.Field;
import com.combatsasality.backend.dto.TableCreateDto;
import com.combatsasality.backend.persistence.models.CreatedTable;
import com.combatsasality.backend.persistence.models.User;
import com.combatsasality.backend.persistence.services.CreatedTableService;
import com.combatsasality.backend.persistence.services.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class SqlHelper {

    @PersistenceContext
    private EntityManager entityManager;

    private final CreatedTableService createdTableService;
    private final UserService userService;

    @Autowired
    public SqlHelper(CreatedTableService createdTableService, UserService userService) {
        this.createdTableService = createdTableService;
        this.userService = userService;
    }

    @Transactional
    public void deleteTable(String name) {
        String sql = String.format("DROP TABLE \"%s\"", name);

        entityManager.createNativeQuery(sql).executeUpdate();
    }


    @Transactional
    public CreatedTableDto createTable(TableCreateDto table, String username) {
        String tableName = table.getTableName() + "__" + username;

        CreatedTable tableExists = this.createdTableService.findByName(tableName);

        if (tableExists != null) {
            return null;
        }

        List<Field> fields = table.getFields();

        StringBuilder createSql = new StringBuilder(String.format("CREATE TABLE \"%s\" (id SERIAL PRIMARY KEY,", tableName));

        for (Field field : fields) {
            createSql.append(String.format(" \"%s\" %s %s %s,", field.getName(), field.getType(), field.isUnique() ? "UNIQUE" : "", field.isCanBeNull() ? "NOT NULL" : ""));
        }

        createSql.deleteCharAt(createSql.length()-1);
        createSql.append(");");

        entityManager.createNativeQuery(createSql.toString()).executeUpdate();

        CreatedTable createdTable = this.createdTableService.create(tableName);
        User owner = this.userService.findByUsername(username);


        createdTable.setOwner(owner);

        return new CreatedTableDto(createdTable);
    }

    private List<String> getColumnNames(String tableName) {
        String sql = """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = :tableName
        ORDER BY ordinal_position
        """;

        return entityManager.createNativeQuery(sql)
                .setParameter("tableName", tableName)
                .getResultList();
    }

    @Transactional
    public List<Map<String, Object>> getRowsFromDynamicTable(String tableName) {
        String sql = String.format("SELECT * FROM \"%s\"", tableName);

        List<Object[]> results = entityManager.createNativeQuery(sql).getResultList();
        List<String> columnNames = getColumnNames(tableName);

        List<Map<String, Object>> rows = new java.util.ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new java.util.HashMap<>();
            for (int i = 0; i < columnNames.size(); i++) {
                map.put(columnNames.get(i), row[i]);
            }
            rows.add(map);
        }

        return rows;
    }


    @Transactional
    public void insertRowIntoDynamicTable(String tableName, Map<String, Object> data) {
        
        List<String> existingColumns = getColumnNames(tableName);

        
        for (String column : data.keySet()) {
            if (!existingColumns.contains(column)) {
                throw new IllegalArgumentException("Рядка '" + column + "' не існує в таблиці.");
            }
        }

        
        StringBuilder columns = new StringBuilder();
        StringBuilder values = new StringBuilder();

        for (String key : data.keySet()) {
            columns.append("\"").append(key).append("\", ");
            values.append(":").append(key).append(", ");
        }

        
        columns.setLength(columns.length() - 2);
        values.setLength(values.length() - 2);

        String sql = String.format("INSERT INTO \"%s\" (%s) VALUES (%s)", tableName, columns, values);

        var query = entityManager.createNativeQuery(sql);
        data.forEach(query::setParameter);

        query.executeUpdate();
    }

    @Transactional
    public void deleteRowFromDynamicTable(String tableName, Map<String, Object> conditions) {
        
        List<String> existingColumns = getColumnNames(tableName);

        
        for (String column : conditions.keySet()) {
            if (!existingColumns.contains(column)) {
                throw new IllegalArgumentException("Рядка '" + column + "' не існує в таблиці.");
            }
        }

        
        StringBuilder conditionClause = new StringBuilder();
        for (String key : conditions.keySet()) {
            conditionClause.append("\"").append(key).append("\" = :").append(key).append(" AND ");
        }

        
        conditionClause.setLength(conditionClause.length() - 5);

        String sql = String.format("DELETE FROM \"%s\" WHERE %s", tableName, conditionClause);

        var query = entityManager.createNativeQuery(sql);
        conditions.forEach(query::setParameter);

        query.executeUpdate();
    }


}
