package com.crayondata.merchantonboarding.service.impl;

import com.crayondata.merchantonboarding.model.Role;
import com.crayondata.merchantonboarding.model.Tenant;
import com.crayondata.merchantonboarding.model.User;
import com.crayondata.merchantonboarding.repository.RoleRepository;
import com.crayondata.merchantonboarding.repository.TenantRepository;
import com.crayondata.merchantonboarding.repository.UserRepository;
import com.crayondata.merchantonboarding.service.UserService;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
	public void save(User user,boolean encoded) {
		Set<Role> roleSet = new HashSet<>();
		Set<Role> userRoles = user.getRole();
		if (userRoles != null) {
			for (Role roleValues : user.getRole()) {
				Role role = roleRepository.findByRole(roleValues.getRole());
				
				if (role != null)
					roleSet.add(role);
				else
					roleSet.add(new Role(roleValues.getRole()));
			}
			user.setRole(roleSet);
		}
		if(user.getPassword() != null && !encoded)
			user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		userRepository.save(user);
	}

    @Override
    public User findByName(String username) {

        return userRepository.findByName(username);
    }
    
    @Override
    public User findByEmail(String email) {

        return userRepository.findByEmail(email);
    }
}