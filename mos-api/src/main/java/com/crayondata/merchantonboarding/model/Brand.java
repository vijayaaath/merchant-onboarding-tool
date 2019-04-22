package com.crayondata.merchantonboarding.model;

import java.sql.Blob;
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
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.hibernate.validator.constraints.Length;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.web.multipart.MultipartFile;

import com.crayondata.merchantonboarding.service.BrandService;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
@Entity
@EntityListeners(AuditingEntityListener.class)
@Audited
@Table(name = "brand")
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "brand_id", nullable = false)
    private Long brandId;

    @Transient
    private String tenantName;

    @Transient
    private String modifiedTime;

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

    @Column(name = "cdf_brand_id")
    private String cdfBrandId;

    @Transient
    private Long merchantId;

    @Transient
    private List<MultipartFile> image;

    @Transient
    private List<String> tagsList;

    @Transient
    private List<String> subCategoryList;

    @Transient
    private Set<ImageResponse> imageResponse;

    @Column(name = "stores")
    private String stores;

    @Column(name = "name")
    private String name;

    @Column(name = "url")
    private String url;

    @Column(name = "publish_without_offers")
    private String publishWithoutOffers;

    @Column(name = "category")
    private String category;

    @Column(name = "sub_categories")
    private String subCategories;

    @Column(name = "description")
    private String description;

    @Column(name = "tag", length = 2048)
    private String tag;

    /*
     * @Column(name="images") private List<String> imageUrl;
     */

    @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @Audited
    @JoinTable(name = "brand_images", joinColumns = @JoinColumn(name = "brandid"), inverseJoinColumns = @JoinColumn(name = "imageid"))
    private Set<Images> images;

    @Column(name = "email")
    private String email;

    @OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.DETACH })
    @NotAudited
    @JoinColumn(name = "merchant_id")
    private Merchant merchant;

    @OneToOne(fetch = FetchType.EAGER, cascade = { CascadeType.DETACH })
    @NotAudited
    @JoinColumn(name = "tenant_name")
    private Tenant tenant;

    @Column(name = "status")
    private String status;

    @Column(name = "tag_status")
    private String tagStatus;

    public Brand() {

    }

    public Brand(String category, String subCategories, String name, String tag, String url,
            Merchant merchant, Tenant tenant, String cdfBrandId, Set<Images> images, String tagStatus) {
        this.category = category;
        this.subCategories = subCategories;
        this.name = name;
        this.tag = tag;
        this.url = url;
        this.merchant = merchant;
        this.tenant = tenant;
        this.cdfBrandId = cdfBrandId;
        this.images = images;
        this.tagStatus = tagStatus;
    }

    public Long getBrandId() {
        return brandId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPublishWithoutOffers() {
        return publishWithoutOffers;
    }

    public void setPublishWithoutOffers(String publishWithoutOffers) {
        this.publishWithoutOffers = publishWithoutOffers;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubCategories() {
        return subCategories;
    }

    public void setSubCategories(String subCategories) {
        this.subCategories = subCategories;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTags() {
        return tag;
    }

    public void setTags(String tags) {
        this.tag = tags;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }

    public Long getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Long merchantId) {
        this.merchantId = merchantId;
    }

    public List<MultipartFile> getImage() {
        return image;
    }

    public List<String> getTagsList() {
        return tagsList;
    }

    public void setTagsList(List<String> tagsList) {
        this.tagsList = tagsList;
    }

    public List<String> getSubCategoryList() {
        return subCategoryList;
    }

    public void setSubCategoryList(List<String> subCategoryList) {
        this.subCategoryList = subCategoryList;
    }

    public void setImage(List<MultipartFile> image) {
        this.image = image;
    }

    public Set<Images> getImages() {
        return images;
    }

    public void setImages(Set<Images> images) {
        this.images = images;
    }

    public Set<ImageResponse> getImageResponse() {
        return imageResponse;
    }

    public void setImageResponse(Set<ImageResponse> imageResponse) {
        this.imageResponse = imageResponse;
    }

    public String getStores() {
        return stores;
    }

    public void setStores(String stores) {
        this.stores = stores;
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

    public String getModifiedTime() {
        try{
            String modifiedTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp);
            return modifiedTime;
        } catch(Exception e) {
            return null;
        }
    }

    public void setModifiedTime(String modifiedTime) {
        this.modifiedTime = modifiedTime;
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

    public String getCdfBrandId() {
        return cdfBrandId;
    }

    public void setCdfBrandId(String cdfBrandId) {
        this.cdfBrandId = cdfBrandId;
    }

    public String isTagStatus() {
        return tagStatus;
    }

    public void setTagStatus(String tagStatus) {
        this.tagStatus = tagStatus;
    }

}
