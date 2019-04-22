package com.crayondata.merchantonboarding.service;

import com.crayondata.merchantonboarding.model.User;

public interface UserService {
    void save(User user,boolean encoded);
    User findByName(String username);
    User findByEmail(String email);
}