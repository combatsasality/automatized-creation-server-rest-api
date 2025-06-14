package com.combatsasality.backend.controllers;

import com.combatsasality.backend.authentication.JwtUtil;
import com.combatsasality.backend.dto.*;
import com.combatsasality.backend.persistence.exceptions.AlreadyExistsException;
import com.combatsasality.backend.persistence.models.CreatedTable;
import com.combatsasality.backend.persistence.models.User;
import com.combatsasality.backend.persistence.services.CreatedTableService;
import com.combatsasality.backend.persistence.services.UserService;
import com.combatsasality.backend.utils.ApiResponse;
import com.combatsasality.backend.utils.SqlHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class ControllerTests {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private SqlHelper sqlHelper;

    @Mock
    private UserService userService;

    @Mock
    private CreatedTableService createdTableService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private SqlController sqlController;

    @InjectMocks
    private CustomController customController;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    
    @Test
    void testGetTables_Success() {
        
        String username = "testuser";
        when(authentication.getName()).thenReturn(username);
        List<CreatedTable> tables = new ArrayList<>();
        CreatedTable table = new CreatedTable();
        table.setName("table1__testuser");

        table.setAvailableMethods(Arrays.asList(CreatedTable.Methods.GET, CreatedTable.Methods.POST));
        tables.add(table);
        when(createdTableService.findByOwner(username)).thenReturn(tables);

        
        ResponseEntity<ApiResponse> response = sqlController.get(authentication);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("", response.getBody().getMessage());
        List<TableGetDto> result = (List<TableGetDto>) response.getBody().getData();
        assertEquals(1, result.size());
        assertEquals("table1", result.get(0).getTableName());
        assertEquals("/custom/testuser/table1", result.get(0).getPath());
    }

    @Test
    void testCreateTable_Success() {
        
        String username = "testuser";
        when(authentication.getName()).thenReturn(username);
        TableCreateDto tableDto = new TableCreateDto();
        tableDto.setTableName("newtable");
        tableDto.setFields(Collections.singletonList(new Field("field1", Field.Type.TEXT)));
        CreatedTableDto createdTableDto = new CreatedTableDto();
        when(sqlHelper.createTable(any(TableCreateDto.class), anyString())).thenReturn(createdTableDto);

        
        ResponseEntity<ApiResponse> response = sqlController.create(tableDto, authentication);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Таблица успішно створена", response.getBody().getMessage());
        assertEquals(createdTableDto, response.getBody().getData());
    }

    @Test
    void testCreateTable_TableExists() {
        
        String username = "testuser";
        when(authentication.getName()).thenReturn(username);
        TableCreateDto tableDto = new TableCreateDto();
        when(sqlHelper.createTable(any(TableCreateDto.class), anyString())).thenReturn(null);

        
        ResponseEntity<ApiResponse> response = sqlController.create(tableDto, authentication);

        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Таблиця вже існує", response.getBody().getMessage());
    }

    @Test
    void testChangeTable_Success() {
        
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        CreatedTable table = new CreatedTable();
        table.setName("table1__testuser");
        table.setOwner(user);
        TablePostDto postDto = new TablePostDto();
        postDto.setTableName("table1");
        postDto.setMethods(Arrays.asList(CreatedTable.Methods.GET, CreatedTable.Methods.POST));
        when(authentication.getName()).thenReturn(username);
        when(userService.findByUsername(username)).thenReturn(user);
        when(createdTableService.findByName("table1__testuser")).thenReturn(table);
        when(createdTableService.save(any(CreatedTable.class))).thenReturn(table);

        
        ResponseEntity<ApiResponse> response = sqlController.change(postDto, authentication);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Таблиця успішно змінена", response.getBody().getMessage());
    }

    @Test
    void testChangeTable_TableNotFound() {
        
        String username = "testuser";
        TablePostDto postDto = new TablePostDto();
        postDto.setTableName("table1");
        when(authentication.getName()).thenReturn(username);
        when(userService.findByUsername(username)).thenReturn(new User());
        when(createdTableService.findByName("table1__testuser")).thenReturn(null);

        
        ResponseEntity<ApiResponse> response = sqlController.change(postDto, authentication);

        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Таблиці не існує", response.getBody().getMessage());
    }

    @Test
    void testDeleteTable_Success() {
        
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        CreatedTable table = new CreatedTable();
        table.setName("table1__testuser");
        table.setOwner(user);
        when(authentication.getName()).thenReturn(username);
        when(userService.findByUsername(username)).thenReturn(user);
        when(createdTableService.findByName("table1__testuser")).thenReturn(table);

        List<String> deleteTables = new ArrayList<>();
        deleteTables.add("table1");

        ResponseEntity<ApiResponse> response = sqlController.delete(deleteTables, authentication);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Таблиця успішно видалено", response.getBody().getMessage());
        verify(createdTableService).delete(table);
        verify(sqlHelper).deleteTable("table1__testuser");
    }

    @Test
    void testDeleteTable_TableNotFound() {
        
        String username = "testuser";
        when(authentication.getName()).thenReturn(username);
        when(userService.findByUsername(username)).thenReturn(new User());
        when(createdTableService.findByName("table1__testuser")).thenReturn(null);

        List<String> deleteTables = new ArrayList<>();
        deleteTables.add("table1");

        ResponseEntity<ApiResponse> response = sqlController.delete(deleteTables, authentication);

        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Таблиці не існує", response.getBody().getMessage());
    }

    
    @Test
    void testGetRows_Success() {
        
        String username = "testuser";
        String tableName = "table1";
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(Collections.singletonMap("field1", "value1"));
        when(sqlHelper.getRowsFromDynamicTable("table1__testuser")).thenReturn(data);

        
        ResponseEntity<ApiResponse> response = customController.get(username, tableName);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("", response.getBody().getMessage());
        assertEquals(data, response.getBody().getData());
    }

    @Test
    void testGetRows_EmptyTable() {
        
        String username = "testuser";
        String tableName = "table1";
        when(sqlHelper.getRowsFromDynamicTable("table1__testuser")).thenReturn(new ArrayList<>());

        
        ResponseEntity<ApiResponse> response = customController.get(username, tableName);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Таблиця пуста", response.getBody().getMessage());
    }

    @Test
    void testInsertRow_Success() {
        
        String username = "testuser";
        String tableName = "table1";
        Map<String, Object> body = Collections.singletonMap("field1", "value1");
        doNothing().when(sqlHelper).insertRowIntoDynamicTable(anyString(), any(Map.class));

        
        ResponseEntity<ApiResponse> response = customController.insert(username, tableName, body);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Запис успішно додано", response.getBody().getMessage());
    }

    @Test
    void testInsertRow_InvalidData() {
        
        String username = "testuser";
        String tableName = "table1";
        Map<String, Object> body = Collections.singletonMap("field1", "value1");
        doThrow(new IllegalArgumentException("Invalid data")).when(sqlHelper).insertRowIntoDynamicTable(anyString(), any(Map.class));

        
        ResponseEntity<ApiResponse> response = customController.insert(username, tableName, body);

        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Помилка: Invalid data", response.getBody().getMessage());
    }

    @Test
    void testDeleteRow_Success() {
        
        String username = "testuser";
        String tableName = "table1";
        Map<String, Object> conditions = Collections.singletonMap("field1", "value1");
        doNothing().when(sqlHelper).deleteRowFromDynamicTable(anyString(), any(Map.class));

        
        ResponseEntity<ApiResponse> response = customController.delete(username, tableName, conditions);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Запис успішно видалено", response.getBody().getMessage());
    }

    @Test
    void testDeleteRow_InvalidConditions() {
        
        String username = "testuser";
        String tableName = "table1";
        Map<String, Object> conditions = Collections.singletonMap("field1", "value1");
        doThrow(new IllegalArgumentException("Invalid conditions")).when(sqlHelper).deleteRowFromDynamicTable(anyString(), any(Map.class));

        
        ResponseEntity<ApiResponse> response = customController.delete(username, tableName, conditions);

        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Помилка: Invalid conditions", response.getBody().getMessage());
    }

    
    @Test
    void testGetAllUsers_Success() {
        
        List<User> users = Arrays.asList(new User(), new User());
        when(userService.getAllUsers()).thenReturn(users);

        
        List<User> result = userController.getAllUsers();

        
        assertEquals(2, result.size());
        verify(userService).getAllUsers();
    }

    @Test
    void testCreateUser_Success() {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("newuser");
        userDto.setPassword("password");

        
        ResponseEntity<ApiResponse> response = userController.createUser(userDto);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Користувач успішно створений", response.getBody().getMessage());
    }

    @Test
    void testCreateUser_AlreadyExists() {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("existinguser");
        userDto.setPassword("password");
        doThrow(new AlreadyExistsException()).when(userService).createUser(anyString(), anyString());

        
        ResponseEntity<ApiResponse> response = userController.createUser(userDto);

        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Користувач с таким іменем вже існує", response.getBody().getMessage());
    }

    @Test
    void testAuthenticate_Success() {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("testuser");
        userDto.setPassword("password");
        when(userService.authenticateUser(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(anyString())).thenReturn("jwt_token");

        
        ResponseEntity<ApiResponse> response = userController.authenticate(userDto);

        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Ви успішно авторизовані", response.getBody().getMessage());
        assertEquals("jwt_token", response.getBody().getData());
    }

    @Test
    void testAuthenticate_Failure() {
        
        UserDto userDto = new UserDto();
        userDto.setUsername("testuser");
        userDto.setPassword("wrongpassword");
        when(userService.authenticateUser(anyString(), anyString())).thenReturn(false);

        
        ResponseEntity<ApiResponse> response = userController.authenticate(userDto);

        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Невірний логін або пароль", response.getBody().getMessage());
    }
}