package com.combatsasality.backend.persistence.services;

import com.combatsasality.backend.persistence.models.CreatedTable;
import com.combatsasality.backend.persistence.models.User;
import com.combatsasality.backend.persistence.repositories.CreatedTableRepository;
import com.combatsasality.backend.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreatedTableService {

    private final CreatedTableRepository tableRepository;
    private final UserRepository userRepository;

    @Autowired
    public CreatedTableService(CreatedTableRepository createdTableRepository, UserRepository userRepository) {
    this.tableRepository = createdTableRepository;
    this.userRepository = userRepository;
    }

    public List<CreatedTable> getAllCreatedTables() {
        return tableRepository.findAll();
    }

    public List<CreatedTable> findByOwner(String username) {
        User user = userRepository.findByUsername(username);
        return tableRepository.findByOwner(user);
    }

    public CreatedTable findByName(String name) {
        return this.tableRepository.findByName(name);
    }


    public CreatedTable create(String name) {
        return this.tableRepository.save(new CreatedTable(name));
    }

    public CreatedTable save(CreatedTable table) {
        return this.tableRepository.save(table);
    }

    public void delete(CreatedTable table) {
        this.tableRepository.delete(table);
    }
}
