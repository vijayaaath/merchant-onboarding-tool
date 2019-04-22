package com.crayondata.merchantonboarding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.crayondata.merchantonboarding.model.SubCategory;

public interface SubCategoryRepository extends PagingAndSortingRepository<SubCategory, Long>{
    
    public static final String FIND_SUBCATEGORIES_BY_CATEGORY = "SELECT category_name, sub_category_name FROM sub_category WHERE category_name in :category";
    public static final String FIND_ALL_CATEGORIES = "SELECT distinct category_name FROM sub_category";
    
    SubCategory findBySubCategoryId(@Param("id") Long id);

    @Query(value = FIND_SUBCATEGORIES_BY_CATEGORY, nativeQuery = true)
    List<Object[]> findByCategory(@Param("category")List<String> category);
    
    @Query(value = FIND_ALL_CATEGORIES, nativeQuery = true)
    List<String> findAllCategories();
}