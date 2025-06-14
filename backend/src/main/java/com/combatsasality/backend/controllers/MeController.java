package com.combatsasality.backend.controllers;

import com.combatsasality.backend.dto.ChangePasswordDto;
import com.combatsasality.backend.persistence.exceptions.BadValidationException;
import com.combatsasality.backend.persistence.models.User;
import com.combatsasality.backend.persistence.services.UserService;
import com.combatsasality.backend.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
public class MeController {
    private final UserService userService;

    @Autowired
    public MeController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping
    public User getMe(Authentication authentication) {
        return userService.findByUsername(authentication.getName());
    }

    @PostMapping
    public ResponseEntity<ApiResponse> changePassword(Authentication authentication, @RequestBody ChangePasswordDto changePasswordDto) {
        String newPassword = changePasswordDto.getNewPassword();

        if (newPassword.length() < 8 || newPassword.length() > 24) {
            throw new BadValidationException("api.lessThen8");
        }

        if (!newPassword.matches(".*[A-Za-z].*")) {
            throw new BadValidationException("api.containLetter");
        }


        User user = userService.findByUsername(authentication.getName());


        if (!user.authenticate(changePasswordDto.getOldPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("api.badPassword"));
        }

        user.setRawPassword(newPassword);
        userService.save(user);

        return ResponseEntity.ok(new ApiResponse("api.passwordChanged"));

    }

}
