package com.crayondata.merchantonboarding.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BrandResponse{
	private Brand brand;
	private Object outletCount;
	private Object activeOfferCount;
	private Object pendingOfferCount;
	private Map<Object,List<Object>> countryCityMap = new HashMap<Object,List<Object>>();
	
	public Map<Object, List<Object>> getCountryCityMap() {
		return countryCityMap;
	}
	public void setCountryCityMap(Map<Object, List<Object>> countryCityMap) {
		this.countryCityMap = countryCityMap;
	}
	public Brand getBrand() {
		return brand;
	}
	public void setBrand(Brand brand) {
		this.brand = brand;
	}
	
	public Object getOutletCount() {
		return outletCount;
	}
	public void setOutletCount(Object outletCount) {
		this.outletCount = outletCount;
	}
	public Object getActiveOfferCount() {
		return activeOfferCount;
	}
	public void setActiveOfferCount(Object activeOfferCount) {
		this.activeOfferCount = activeOfferCount;
	}
	public Object getPendingOfferCount() {
		return pendingOfferCount;
	}
	public void setPendingOfferCount(Object pendingOfferCount) {
		this.pendingOfferCount = pendingOfferCount;
	}
	public void setPendingOfferCount(long pendingOfferCount) {
		this.pendingOfferCount = pendingOfferCount;
	}
	
}
