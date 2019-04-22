package com.crayondata.merchantonboarding.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
@Entity
@Table(name = "country")
public class Country {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="city_id", nullable = false)
    private Long cityId;
	
	@Column(name="city")
    private String city;
	
	@Column(name="country")
    private String country;

	public Long getCityId() {
		return cityId;
	}

	public void setCityId(Long cityId) {
		this.cityId = cityId;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}
	
}
