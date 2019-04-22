package com.crayondata.merchantonboarding.model;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;
    
    @Transient
    private String tenantName;

	@Column(name = "name", nullable = false, unique = false)
    @NotEmpty(message = "*Please provide an username")
    private String name;

    @Column(name = "email_id", nullable = false, unique = true)
    @Email(message = "*Please provide a valid Email")
    @NotEmpty(message = "*Please provide an email")
    private String email;


    @Column(name = "password", nullable = false)
    @Length(min = 5, message = "*Your password must have at least 5 characters")
    @NotEmpty(message = "*Please provide your password")
    private String password;
    
    

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "roleid"))
    private Set<Role> roles;

 
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "tenant_name")
    private Tenant tenant;
	
	@ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinTable(name = "user_merchant", joinColumns = @JoinColumn(name = "userid"), inverseJoinColumns = @JoinColumn(name = "merchantid"))
    private Set<Merchant> merchants;


	public Long getId() {
		return id;
	}


	public Tenant getTenant() {
		return tenant;
	}


	public void setTenant(Tenant tenant) {
		this.tenant = tenant;
	}


	public String getName() {
        return name;
    }


    public String getEmail() {
        return email;
    }

    public void setName(String name) {
        this.name = name;
    }


    public void setEmail(String email) {
        this.email = email;
    }

    //@JsonIgnore
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
        //this.password = password;
    }

    public Set<Role> getRole() {
        return roles;
    }

    public void setRole(Set<Role> roles) {
        this.roles = roles;
    }
    

	public String getTenantName() {
		return tenantName;
	}


	public void setTenantName(String tenantName) {
		this.tenantName = tenantName;
	}
	
	
	public Set<Merchant> getMerchants() {
		return merchants;
	}

	public void setMerchants(Set<Merchant> merchants) {
		this.merchants = merchants;
	}
	
	public User() {
    }

    public User(String name, String email, String password, Set<Role> roles, Tenant tenant,Set<Merchant> merchants) {
        this.name = name;
        this.email = email;
        setPassword(password);
        this.roles = roles;
        this.merchants = merchants;
        this.tenant = tenant;
    }


	


	@Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password.substring(0,10) + '\'' +
                ", roles=" + roles +
                '}';
    }
}
