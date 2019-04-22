package com.crayondata.merchantonboarding.model;


import java.sql.Timestamp;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
@Entity
@EntityListeners(AuditingEntityListener.class)
@Audited
@Table(name = "merchant")
public class Merchant {
	
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="merchant_id", nullable = false)
    private Long merchantId;
    
    @Transient
    private String tenantName;
    
    @Column(name = "operation")
    private String operation;
      
    @Column(name = "modified_time",nullable = false, updatable = false)
    private Timestamp timestamp;
    
    @Column(name = "created_by")
    @CreatedBy
    private String createdBy;
 
    @Column(name = "modified_by")
    @LastModifiedBy
    private String modifiedBy;
    
	@Column(name="name")
    private String name;
	
	@Column(name="cdf_merchant_id")
    private String cdfMerchantId;
	
	@Column(name="business_type")
    private String businessType;
	
	@Column(name="description")
    private String description;
	
	@Column(name="commercial_model")
    private String commercialModel;
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.ALL})
	@Audited
    @JoinColumn(name = "address_id")
    private Address address;
	
	@Column(name="contact_person")
    private String contactPerson;
	
	@Column(name="phone_no")
    private String phoneNumber;
	
	@Column(name="email")
    private String email;
	
	@Column(name="business_title")
    private String businessTitle;
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@NotAudited
    @JoinColumn(name = "tenant_name")
    private Tenant tenant;
	
    @Column(name = "status")
    private String status;

    public Merchant() {

    }

    public Merchant(String name, Address address, Tenant tenant, String cdfMerchantId) {
        this.name = name;
        this.address = address;
        this.tenant = tenant;
        this.cdfMerchantId = cdfMerchantId;
    }

	public Long getMerchantId() {
		return merchantId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBusinessType() {
		return businessType;
	}

	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCommercialModel() {
		return commercialModel;
	}

	public void setCommercialModel(String commercialModel) {
		this.commercialModel = commercialModel;
	}


	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public String getContactPerson() {
		return contactPerson;
	}

	public void setContactPerson(String contactPerson) {
		this.contactPerson = contactPerson;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getBusinessTitle() {
		return businessTitle;
	}

	public void setBusinessTitle(String businessTitle) {
		this.businessTitle = businessTitle;
	}

	public Tenant getTenant() {
		return tenant;
	}

	public void setTenant(Tenant tenant) {
		this.tenant = tenant;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getTenantName() {
		return tenantName;
	}

	public void setTenantName(String tenantName) {
		this.tenantName = tenantName;
	}
	
	@PrePersist
    public void onPrePersist() {
        audit("INSERT");
    }
      
    @PreUpdate
    public void onPreUpdate() {
        audit("UPDATE");
    }
      
    @PreRemove
    public void onPreRemove() {
        audit("DELETE");
    }
      
    private void audit(String operation) {
        setOperation(operation);
        setTimestamp(System.currentTimeMillis());
    }

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	public Timestamp getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(long timestamp) {
		this.timestamp = new Timestamp(timestamp);
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public void setMerchantId(Long merchantId) {
		this.merchantId = merchantId;
	}

	public String getCdfMerchantId() {
		return cdfMerchantId;
	}

	public void setCdfMerchantId(String cdfMerchantId) {
		this.cdfMerchantId = cdfMerchantId;
	}

}
