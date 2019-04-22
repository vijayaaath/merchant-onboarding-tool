package com.crayondata.merchantonboarding.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "category")
public class Category {
    
    @Id
   // @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="category_name", nullable = false)
    private String categoryName;
    
    @Column(name="category_label")
    private String label;

    public String getcategoryName() {
        return categoryName;
    }

    public void setCategoryId(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}