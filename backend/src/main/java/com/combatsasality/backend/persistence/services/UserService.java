package com.combatsasality.backend.persistence.services;

import com.combatsasality.backend.persistence.exceptions.AlreadyExistsException;
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


        User user = new User(username);
        user.setRawPassword(password);

        return userRepository.save(user);
    }

    public boolean authenticateUser(String username, String password) {
        User user = this.userRepository.findByUsername(username);

        return user.authenticate(password);
    }


}
