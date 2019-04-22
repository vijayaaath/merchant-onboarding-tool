package com.crayondata.merchantonboarding.model;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Audited
@Table(name = "address")
public class Address {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="address_id", nullable = false)
    private Long addressId;
	
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
	
	@Column(name="unit_no")
    private String unitNo;
	
	@Column(name="floor")
    private String floor;
	
	@Column(name="building_name")
    private String buildingName;
	
	@Column(name="street_no")
    private String streetNo;
	
	@Column(name="street_name")
    private String streetName;
	
	@Column(name="road_name_1")
    private String roadName1;
	
	@Column(name="road_name_2")
    private String roadName2;
	
	@Column(name="locality")
    private String locality;
	
	@Column(name="city_name")
    private String cityName = null;
	
	@Column(name="postal_code")
    private String postalCode;
	
	@Column(name="country")
    private String country;
	
	@Column(name="cdf_address_id")
    private String cdfAddressId;
	
	public Address() {
	    
	}
	
	public Address(String country, String unitNo, String cityName, String cdfAddressId) {
	    this.country = country;
	    this.unitNo = unitNo;
	    this.cityName = cityName;
	    this.cdfAddressId = cdfAddressId;
	}

	public String getUnitNo() {
		return unitNo;
	}

	public void setUnitNo(String unitNo) {
		this.unitNo = unitNo;
	}

	public String getStreetNo() {
		return streetNo;
	}

	public void setStreetNo(String streetNo) {
		this.streetNo = streetNo;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public Long getAddressId() {
		return addressId;
	}

	public String getFloor() {
		return floor;
	}

	public void setFloor(String floor) {
		this.floor = floor;
	}

	public String getBuildingName() {
		return buildingName;
	}

	public void setBuildingName(String buildingName) {
		this.buildingName = buildingName;
	}

	public String getStreetName() {
		return streetName;
	}

	public void setStreetName(String streetName) {
		this.streetName = streetName;
	}

	public String getRoadName1() {
		return roadName1;
	}

	public void setRoadName1(String roadName1) {
		this.roadName1 = roadName1;
	}

	public String getRoadName2() {
		return roadName2;
	}

	public void setRoadName2(String roadName2) {
		this.roadName2 = roadName2;
	}

	public String getLocality() {
		return locality;
	}

	public void setLocality(String locality) {
		this.locality = locality;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public void setAddressId(Long addressId) {
		this.addressId = addressId;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
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

	public String getCdfAddressId() {
		return cdfAddressId;
	}

	public void setCdfAddressId(String cdfAddressId) {
		this.cdfAddressId = cdfAddressId;
	}
	
}
