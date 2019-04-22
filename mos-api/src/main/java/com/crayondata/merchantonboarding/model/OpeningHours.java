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
@Table(name = "opening_hours")
public class OpeningHours {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="opening_hours_id", nullable = false)
    private Long openingHoursId;
	
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
	
	@Column(name = "cdf_opening_hours_id")
	private String cdfOpeningHoursId;
	
	@Column(name="monday")
    private String monday;
	
	@Column(name="tuesday")
    private String tuesday;
	
	@Column(name="wednesday")
    private String wednesday;
	
	@Column(name="thursday")
    private String thursday;
	
	@Column(name="friday")
    private String friday;
	
	@Column(name="saturday")
    private String saturday;
	
	@Column(name="sunday")
    private String sunday;

    public OpeningHours() {

    }

    public OpeningHours(String sunday, String monday, String tuesday, String wednesday, String thursday,
            String friday, String saturday, String cdfOpeningHoursId) {
        this.sunday = sunday;
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
        this.saturday = saturday;
        this.cdfOpeningHoursId = cdfOpeningHoursId;
    }

    public String getMonday() {
        return monday;
    }

	public void setMonday(String monday) {
		this.monday = monday;
	}

	public String getTuesday() {
		return tuesday;
	}

	public void setTuesday(String tuesday) {
		this.tuesday = tuesday;
	}

	public String getWednesday() {
		return wednesday;
	}

	public void setWednesday(String wednesday) {
		this.wednesday = wednesday;
	}

	public String getThursday() {
		return thursday;
	}

	public void setThursday(String thursday) {
		this.thursday = thursday;
	}

	public String getFriday() {
		return friday;
	}

	public void setFriday(String friday) {
		this.friday = friday;
	}

	public String getSaturday() {
		return saturday;
	}

	public void setSaturday(String saturday) {
		this.saturday = saturday;
	}

	public String getSunday() {
		return sunday;
	}

	public void setSunday(String sunday) {
		this.sunday = sunday;
	}

	public Long getOpeningHoursId() {
		return openingHoursId;
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

	public String getCdfOpeningHoursId() {
		return cdfOpeningHoursId;
	}

	public void setCdfOpeningHoursId(String cdfOpeningHoursId) {
		this.cdfOpeningHoursId = cdfOpeningHoursId;
	}
	
}
