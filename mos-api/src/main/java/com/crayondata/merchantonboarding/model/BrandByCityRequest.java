package com.crayondata.merchantonboarding.model;

import java.util.List;

public class BrandByCityRequest {
	private long brandId;
	private List<String> cityCountry;
	public long getBrandId() {
		return brandId;
	}
	public void setBrandId(long brandId) {
		this.brandId = brandId;
	}
	public List<String> getCityCountry() {
		return cityCountry;
	}
	public void setCityCountry(List<String> cityCountry) {
		this.cityCountry = cityCountry;
	}
}
