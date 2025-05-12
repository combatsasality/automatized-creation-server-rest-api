package com.combatsasality.backend.persistence.models;

import com.combatsasality.backend.utils.HelpHandler;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "role", nullable = false)
    private Role role = Role.USER;


    public User() {
    }

    public User(String username) {
        this.username = username;
    }


    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public User(String username, Role role) {
        this.username = username;
        this.role = role;
    }


    public void setRawPassword(String rawPassword) {
        this.password = HelpHandler.hashString(rawPassword);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Role getRole() {
        return role;
    }

    public boolean authenticate(String rawPassword) {
        return this.password.equals(HelpHandler.hashString(rawPassword));
    }

    public enum Role {
        ADMIN,
        USER
    }
}
