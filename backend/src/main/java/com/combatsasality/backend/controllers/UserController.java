package com.combatsasality.backend.controllers;

import com.combatsasality.backend.authentication.JwtUtil;
import com.combatsasality.backend.utils.ApiResponse;
import com.combatsasality.backend.dto.UserDto;
import com.combatsasality.backend.persistence.exceptions.AlreadyExistsException;
import com.combatsasality.backend.persistence.models.User;
import com.combatsasality.backend.persistence.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }


    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> createUser(@RequestBody UserDto userDto) {
        try {
            userService.createUser(userDto.getUsername(), userDto.getPassword());
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("api.userExists"));
        }


        return ResponseEntity.ok(new ApiResponse("api.createdUser"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> authenticate(@RequestBody UserDto userDto) {
        if (userService.authenticateUser(userDto.getUsername(), userDto.getPassword())) {
            return ResponseEntity.ok(new ApiResponse("api.authorized", jwtUtil.generateToken(userDto.getUsername())));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("api.wrongPassOrUsername"));
    }
}
