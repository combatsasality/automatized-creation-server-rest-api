package com.combatsasality.backend.persistence.repositories;

import com.combatsasality.backend.persistence.models.CreatedTable;
import com.combatsasality.backend.persistence.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CreatedTableRepository extends JpaRepository<CreatedTable, UUID> {

    CreatedTable findByName(String name);
    List<CreatedTable> findByOwner(User owner);


}
