package com.crayondata.merchantonboarding.model;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
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
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
@Entity
@EntityListeners(AuditingEntityListener.class)
@Audited
@Table(name = "offer")
public class Offer {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="offer_id", nullable = false)
    private Long offerId;
	
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

	@Column(name = "cdf_offer_id")
	private String cdfOfferId;
	
	@Transient
	private String validFrom;
	
	@Transient
	private String validTo;
	
	@Transient
	private List<MultipartFile> brandImageOverride;
	
	@Transient
	private Set<ImageResponse> imageResponse;
	
	@Column(name="short_desc")
    private String shortDesc;
	
	@Column(name="med_desc")
    private String medDesc;
	
	@Column(name="long_desc")
    private String longDesc;
	
	@Column(name="valid_from")
    private Timestamp valid_from;
	
	@Column(name="valid_to")
    private Timestamp valid_to;
	
	@Column(name="postal_code")
    private String postalCode;
	
	@Column(name="promo_code")
    private String promoCode;
	
	@Column(name="redeem_url")
    private String redeemUrl;
	
	@Column(name="brand_name")
    private String brandName;
	
	@Column(name="eligibility_and_remarks")
    private String eligibilityAndRemarks;
	
	/*@Column(name="offer_redeem_outlets")
    private String offerRedeemOutlets;*/
	
	@ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@NotAudited
    @JoinTable(name = "offer_redeem_outlets", joinColumns = @JoinColumn(name = "offer_id"), inverseJoinColumns = @JoinColumn(name = "outlet_id"))
    private Set<Outlet> offerRedeemOutlets;
	
	@ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST,CascadeType.MERGE})
	@Audited
    @JoinTable(name = "offer_images", joinColumns = @JoinColumn(name = "offerid"), inverseJoinColumns = @JoinColumn(name = "imageid"))
    private Set<Images> images;
	
	@Column(name="status")
    private String status;
	
	/*@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
    @JoinColumn(name = "outlet_id")
    private Outlet outlet;*/
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@NotAudited
    @JoinColumn(name = "tenant_name")
    private Tenant tenant;
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@NotAudited
    @JoinColumn(name = "merchant_id")
	private Merchant merchant;
	
	@OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH})
	@NotAudited
    @JoinColumn(name = "brand_id")
    private Brand brand;

    public Offer() {

    }

    public Offer(String longDesc, String shortDesc, Timestamp validFrom, Timestamp validTo, Brand brand,
            Merchant merchant, Tenant tenant, String brandName, String cdfOfferId) {
        this.longDesc = longDesc;
        this.shortDesc = shortDesc;
        this.valid_from = validFrom;
        this.valid_to = validTo;
        this.brand = brand;
        this.merchant = merchant;
        this.tenant = tenant;
        this.brandName = brandName;
        this.cdfOfferId = cdfOfferId;
    }
	public Long getOfferId() {
		return offerId;
	}

	public String getShortDesc() {
		return shortDesc;
	}

	public void setShortDesc(String shortDesc) {
		this.shortDesc = shortDesc;
	}

	public String getMedDesc() {
		return medDesc;
	}

	public void setMedDesc(String medDesc) {
		this.medDesc = medDesc;
	}

	public String getLongDesc() {
		return longDesc;
	}

	public void setLongDesc(String longDesc) {
		this.longDesc = longDesc;
	}

	public String getValidFrom() {
		//validFrom = new SimpleDateFormat("yyyy:MM:dd HH:mm:ss").format(valid_from);
		return validFrom;
	}

	public void setValidFrom(String validFrom) {
		this.validFrom = validFrom;
	}

	public String getValidTo() {
		return validTo;
	}

	public void setValidTo(String validTo) {
		this.validTo = validTo;
	}

	public String getValid_from() {
		String from_date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(valid_from);
		return from_date;
	}

	public void setValid_from(Timestamp valid_from) {
		this.valid_from = valid_from;
	}

	public String getValid_to() {
		String to_date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(valid_to);
		return to_date;
	}

	public void setValid_to(Timestamp valid_to) {
		this.valid_to = valid_to;
	}

	public String getPostalCode() {
		return postalCode;
	}

	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}

	public String getPromoCode() {
		return promoCode;
	}

	public void setPromoCode(String promoCode) {
		this.promoCode = promoCode;
	}

	public String getRedeemUrl() {
		return redeemUrl;
	}

	public void setRedeemUrl(String redeemUrl) {
		this.redeemUrl = redeemUrl;
	}

	public String getEligibilityAndRemarks() {
		return eligibilityAndRemarks;
	}

	public void setEligibilityAndRemarks(String eligibilityAndRemarks) {
		this.eligibilityAndRemarks = eligibilityAndRemarks;
	}

	public List<MultipartFile> getBrandImageOverride() {
		return brandImageOverride;
	}

	public void setBrandImageOverride(List<MultipartFile> brandImageOverride) {
		this.brandImageOverride = brandImageOverride;
	}

	public Set<Images> getImages() {
		return images;
	}

	public void setImages(Set<Images> images) {
		this.images = images;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	/*public Outlet getOutlet() {
		return outlet;
	}

	public void setOutlet(Outlet outlet) {
		this.outlet = outlet;
	}
*/
	public Tenant getTenant() {
		return tenant;
	}

	public void setTenant(Tenant tenant) {
		this.tenant = tenant;
	}

	public Merchant getMerchant() {
		return merchant;
	}

	public void setMerchant(Merchant merchant) {
		this.merchant = merchant;
	}


	public Brand getBrand() {
		return brand;
	}

	public void setBrand(Brand brand) {
		this.brand = brand;
	}

	public String getTenantName() {
		return tenantName;
	}

	public void setTenantName(String tenantName) {
		this.tenantName = tenantName;
	}

	public Set<Outlet> getOfferRedeemOutlets() {
		return offerRedeemOutlets;
	}

	public void setOfferRedeemOutlets(Set<Outlet> offerRedeemOutlets) {
		this.offerRedeemOutlets = offerRedeemOutlets;
	}

	public String getBrandName() {
		return brandName;
	}

	public void setBrandName(String brandName) {
		this.brandName = brandName;
	}

	public Set<ImageResponse> getImageResponse() {
		return imageResponse;
	}

	public void setImageResponse(Set<ImageResponse> imageResponse) {
		this.imageResponse = imageResponse;
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

	public String getCdfOfferId() {
		return cdfOfferId;
	}

	public void setCdfOfferId(String cdfOfferId) {
		this.cdfOfferId = cdfOfferId;
	}
	
}
