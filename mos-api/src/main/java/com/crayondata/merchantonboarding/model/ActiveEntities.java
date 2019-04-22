package com.crayondata.merchantonboarding.model;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class ActiveEntities {
	private Long merchants;
	private Long brands;
	private Long outlets;
	private Long offers;
	private List<Offer> activeOffers;
	public Long getMerchants() {
		return merchants;
	}
	public void setMerchants(Long merchants) {
		this.merchants = merchants;
	}
	public Long getBrands() {
		return brands;
	}
	public void setBrands(Long brands) {
		this.brands = brands;
	}
	public Long getOutlets() {
		return outlets;
	}
	public void setOutlets(Long outlets) {
		this.outlets = outlets;
	}
	public Long getOffers() {
		return offers;
	}
	public void setOffers(Long offers) {
		this.offers = offers;
	}
	public List<Offer> getActiveOffers() {
		return activeOffers;
	}
	public void setActiveOffers(List<Offer> activeOffers) {
		this.activeOffers = activeOffers;
	}
	
}
