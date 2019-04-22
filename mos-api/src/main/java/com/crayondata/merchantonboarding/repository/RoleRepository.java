package com.crayondata.merchantonboarding.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.crayondata.merchantonboarding.model.Role;

public interface RoleRepository extends PagingAndSortingRepository<Role, Long> {

    Role findByRole(String role);
}
