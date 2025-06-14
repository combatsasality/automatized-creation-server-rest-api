package com.combatsasality.backend.persistence.services;

import com.combatsasality.backend.persistence.exceptions.AlreadyExistsException;
import com.combatsasality.backend.persistence.exceptions.BadValidationException;
import com.combatsasality.backend.persistence.models.CreatedTable;
import com.combatsasality.backend.persistence.models.User;
import com.combatsasality.backend.persistence.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User createUser(String username, String password) {
        if (userRepository.findByUsername(username) != null) {
            throw new AlreadyExistsException();
        }

        if (password.length() < 8 || password.length() > 24) {
            throw new BadValidationException("api.lessThen8");
        }

        if (!password.matches(".*[A-Za-z].*")) {
            throw new BadValidationException("api.containLetter");
        }

        User user = new User(username);
        user.setRawPassword(password);

        return userRepository.save(user);
    }

    public boolean authenticateUser(String username, String password) {
        User user = this.userRepository.findByUsername(username);

        if (user == null) {
            return false;
        }

        return user.authenticate(password);
    }

    public User save(User user) {
        return this.userRepository.save(user);
    }


}
