package com.crayondata.merchantonboarding.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.crayondata.merchantonboarding.model.Merchant;
import com.crayondata.merchantonboarding.model.Role;
import com.crayondata.merchantonboarding.model.Tenant;
import com.crayondata.merchantonboarding.model.User;
import com.crayondata.merchantonboarding.repository.RoleRepository;
import com.crayondata.merchantonboarding.repository.TenantRepository;
import com.crayondata.merchantonboarding.repository.UserRepository;
import com.crayondata.merchantonboarding.security.SecurityServiceImpl;
import com.crayondata.merchantonboarding.service.UserService;

@Controller
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private TenantRepository tenantRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private SecurityServiceImpl securityService;


    @RequestMapping(value = "/home", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> currentLoginUserDetails(){
    	 return new ResponseEntity(userService.findByEmail(securityService.findLoggedInUsername()), HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/api/users", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addUser(
            @RequestBody(required=true) User user)
    {	
    	String tenantName = user.getTenantName();
    	Tenant tenant = tenantRepository.findByName(tenantName);
    	if(tenant == null)
    		return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
    	user.setTenant(tenant);
        userService.save(user,false);
        return new ResponseEntity<>("User added successfully", HttpStatus.OK);
    }




    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/api/users", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getUsers(Pageable pageable){
        Page<User> users = userRepository.findAll(pageable);
        if(users != null)
            return new ResponseEntity<>(users, HttpStatus.OK);
        else
            return new ResponseEntity<>("No users found", HttpStatus.NOT_FOUND);
    }



    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/api/users/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Object> deleteUser(@PathVariable(required=true) long id)
    {
        User userRecord =  userRepository.findOne(id);
        if(userRecord != null) {
            userRepository.delete(userRecord);
            return  new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        }
        else
            return  new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }




    
    @RequestMapping(value = "/api/users/{id}", method = RequestMethod.PATCH)
    @ResponseBody
    public ResponseEntity<Object> updateUser(@PathVariable(required=true) long id, @RequestBody(required=true) User user)
    {
        User userRecord =  userRepository.findOne(id);
        if(userRecord == null)
            return  new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        else {
            String userName = user.getName();
            String userEmail = user.getEmail();
            String userPassword = user.getPassword();
            Set<Merchant> merchants = user.getMerchants();
            //Set<Role> userRoles =  user.getRole();

            if(userName != null)
                userRecord.setName(userName);
            if(userEmail != null)
                userRecord.setEmail(userEmail);
            if(userPassword != null)
                userRecord.setPassword(userPassword);
            if(user.getMerchants() != null)
            	userRecord.setMerchants(user.getMerchants());
            String tenantName = user.getTenantName();
        	Tenant tenant = tenantRepository.findByName(tenantName);
        	if(tenant == null)
        		return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
        	userRecord.setTenant(tenant);
        	if(userPassword==null)
        		userService.save(userRecord,true);
        	else
        		userService.save(userRecord,false);
            return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
        }
    }





    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/api/users/search/findByEmail", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findUserByEmail(@RequestParam(value="email",required=true) String email, Pageable pageable)
    {
        Page<User> users = userRepository.findByEmailIgnoreCaseContaining(email, pageable);
        if(users != null)
            return new ResponseEntity<>(users, HttpStatus.OK);
        else
            return new ResponseEntity<>("No Users found", HttpStatus.NOT_FOUND);
    }




    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/api/roles", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getRoles(Pageable pageable)
    {
        Page<Role> roles =  roleRepository.findAll(pageable);
        if(roles != null)
            return new ResponseEntity<>(roles, HttpStatus.OK);
        else
            return new ResponseEntity<>("No roles found", HttpStatus.NOT_FOUND);
    }




    @RequestMapping(value = "/api/users/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getUserProfile(@PathVariable(required=true) Long id)
    {
        if(securityService.isLoggedInUserAdmin()){
            User user = userRepository.findByUserId(id);
            if(user != null)
                return new ResponseEntity<>(user, HttpStatus.OK);
            else
                return new ResponseEntity("User Not Found", HttpStatus.NOT_FOUND);
        }
        else
        {
            User loggedInUser = userRepository.findByEmail(securityService.findLoggedInUsername());
            if(loggedInUser.getId() == id)
                return new ResponseEntity<>(loggedInUser, HttpStatus.OK);
            else
                return new ResponseEntity("Access Denied", HttpStatus.UNAUTHORIZED);
        }

    }




    @RequestMapping(value = "/api/users/{id}/roles", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getUserRoles(@PathVariable(required=true) Long id)
    {
        if(securityService.isLoggedInUserAdmin()){
            Set<Role> role = userRepository.findByUserId(id).getRole();
            if(role != null)
                return new ResponseEntity<>(role, HttpStatus.OK);
            else
                return new ResponseEntity("User Not Found", HttpStatus.NOT_FOUND);
        }
        else
        {
            User loggedInUser = userRepository.findByEmail(securityService.findLoggedInUsername());
            if(loggedInUser.getId() == id)
                return ResponseEntity.accepted().body(loggedInUser.getRole());
            else
                return new ResponseEntity("Access Denied", HttpStatus.UNAUTHORIZED);
        }
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/api/roles", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addRoles(@RequestBody(required=true) Role role)
    {
    	if(roleRepository.findByRole(role.getRole())!= null)
    		return  new ResponseEntity<>("Role already exists", HttpStatus.ALREADY_REPORTED);
        roleRepository.save(role);
        return new ResponseEntity<>("Role added successfully", HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/api/roles/{id}", method = RequestMethod.PATCH)
    @ResponseBody
    public ResponseEntity<Object> updateRoles(@PathVariable(required=true) long id,@RequestBody(required=true) Role role)
    {
    	Role roleRecord =  roleRepository.findOne(id);
        if(roleRecord == null)
            return  new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        else{
        	if(roleRepository.findByRole(role.getRole())!= null)
        		return  new ResponseEntity<>("Role already exists", HttpStatus.ALREADY_REPORTED);
        	roleRecord.setRole(role.getRole());
        	roleRepository.save(roleRecord);
        	return new ResponseEntity<>("Role Updated successfully", HttpStatus.OK);
        }
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/api/roles/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Object> deleteRole(@PathVariable(required=true) long id)
    {
        Role roleRecord =  roleRepository.findOne(id);
        if(roleRecord != null) {
            roleRepository.delete(roleRecord);
            return  new ResponseEntity<>("Role deleted successfully", HttpStatus.OK);
        }
        else
            return  new ResponseEntity<>("Role not found", HttpStatus.NOT_FOUND);
    }
}