package com.combatsasality.backend.persistence.models;

import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "created_tables")
public class CreatedTable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "availableMethods")
    private List<Methods> availableMethods = List.of(Methods.GET);

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    public CreatedTable(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }


    public List<Methods> getAvailableMethods() {
        return availableMethods;
    }

    public void setAvailableMethods(List<Methods> availableMethods) {
        this.availableMethods = availableMethods;
    }

    public User getOwner() {
        return owner;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public CreatedTable() {
    }

    public enum Methods {
        GET,
        POST,
        DELETE
    }
}
