package com.crayondata.merchantonboarding.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

import com.crayondata.merchantonboarding.model.User;

import java.util.List;

public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    User findByEmail(@Param("email") String email);

    @Query(value = "select * from user where user_id=:id ",nativeQuery = true)
    User findByUserId(@Param("id") Long id);
    
    User findByName(@Param("name") String name);
    
    @Query(value = "select role from role a join (select roleid from user_role where user_id=:userId ) b on a.roleid=b.roleid ;",nativeQuery = true)
    List<Object> findUserRoles(@Param("userId") Long userId);

    Page<User> findByEmailIgnoreCaseContaining(@Param("email") String email, Pageable pageable);

}
