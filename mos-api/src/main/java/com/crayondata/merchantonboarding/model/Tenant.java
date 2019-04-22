package com.crayondata.merchantonboarding.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.envers.Audited;

@Entity
@Audited
@Table(name = "tenant")
public class Tenant {
	 @Id
	 @Column(name="name", nullable = false)
	 private String name;
	 
	 @Column(name="location", nullable = false)
	 private String location;
	 
	 public Tenant(){
	 }
	 
	 public Tenant(String name, String location){
		 this.name = name;
		 this.location = location;
	 }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
	 
	 

}
