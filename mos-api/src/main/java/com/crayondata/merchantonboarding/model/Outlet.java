package com.crayondata.merchantonboarding.model;

import java.sql.Timestamp;
import java.util.List;

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
@Table(name = "outlet")
public class Outlet {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="outlet_id", nullable = false)
    private Long outletId;
	
	@Transient
	private String tenantName;
	
	@Column(name = "operation")
	private String operation;

	@Column(name = "modified_time", nullable = false, updatable = false)
	private Timestamp timestamp;

	@Column(name = "created_by")
	@CreatedBy
	private String createdBy;

	@Column(name = "modified_by")
	@LastModifiedBy
	private String modifiedBy;

	@Transient 
	private Long brandId;
	
	@Column(name="location_id")
    private String locationId;
	
	@Column(name="uniq_outlet_qualities")
    private String uniqOutletQualities;
	
	@Transient
    private List<String> uniqOutletQualitiesList;
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.ALL})
	@Audited
    @JoinColumn(name = "address_id")
    private Address address;
	
	@Column(name="phone")
    private String phone;
	
	@Column(name="url")
    private String url;
	
	@Column(name="brand_name")
    private String brandName;
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
	@Audited
    @JoinColumn(name = "opening_hours_id")
    private OpeningHours openingHours;
	
	@Column(name="status")
    private String status;
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@NotAudited
    @JoinColumn(name = "merchant_id")
	private Merchant merchant;
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@NotAudited
    @JoinColumn(name = "tenant_name")
    private Tenant tenant;

	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@NotAudited
    @JoinColumn(name = "brand_id")
    private Brand brand;

    public Outlet() {

    }

    public Outlet(String url, Address address, Brand brand, Merchant merchant, OpeningHours openingHours,
            Tenant tenant, String brandName) {
        this.url = url;
        this.address = address;
        this.brand = brand;
        this.merchant = merchant;
        this.openingHours = openingHours;
        this.tenant = tenant;
        this.brandName = brandName;
    }
	
	public Long getOutletId() {
		return outletId;
	}

	/*public void setOutletId(Long outletId) {
		this.outletId = outletId;
	}*/

	public String getLocationId() {
		return locationId;
	}

	public void setLocationId(String locationId) {
		this.locationId = locationId;
	}

	public String getUniqOutletQualities() {
		return uniqOutletQualities;
	}

	public void setUniqOutletQualities(String uniqOutletQualities) {
		this.uniqOutletQualities = uniqOutletQualities;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public OpeningHours getOpeningHours() {
		return openingHours;
	}

	public void setOpeningHours(OpeningHours openingHours) {
		this.openingHours = openingHours;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Merchant getMerchant() {
		return merchant;
	}

	public void setMerchant(Merchant merchant) {
		this.merchant = merchant;
	}

	public Tenant getTenant() {
		return tenant;
	}

	public void setTenant(Tenant tenant) {
		this.tenant = tenant;
	}

	public String getTenantName() {
		return tenantName;
	}

	public void setTenantName(String tenantName) {
		this.tenantName = tenantName;
	}

	public Long getBrandId() {
		return brandId;
	}

	public void setBrandId(Long brandId) {
		this.brandId = brandId;
	}

	public Brand getBrand() {
		return brand;
	}
	
	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	public void setBrand(Brand brand) {
		this.brand = brand;
	}
	public List<String> getUniqOutletQualitiesList() {
        return uniqOutletQualitiesList;
    }

    public void setUniqOutletQualitiesList(List<String> uniqOutletQualitiesList) {
        this.uniqOutletQualitiesList = uniqOutletQualitiesList;
    }

    public void setOutletId(Long outletId) {
        this.outletId = outletId;
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

}
