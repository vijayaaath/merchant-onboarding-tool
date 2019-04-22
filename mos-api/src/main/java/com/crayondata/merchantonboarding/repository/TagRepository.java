package com.crayondata.merchantonboarding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.crayondata.merchantonboarding.model.Tag;

public interface TagRepository extends PagingAndSortingRepository<Tag, Long>{
        
        public static final String FIND_TAGS_BY_CATEGORY = "SELECT category_name, tag_name FROM tag WHERE category_name in (:category)";
        public static final String FIND_TAGS_BY_SUB_CATEGORY = "SELECT sub_category_name, tag_name FROM tag WHERE sub_category_name in (:subcategory)";
        public static final String FIND_ALL_SUB_CATEGORIES = "select distinct sub_category_name from sub_category;";
        public static final String FIND_ALL_CATEGORIES = "SELECT distinct category_name FROM tag";
        
        Tag findByTagId(@Param("id") Long id);
        
        @Query(value = FIND_TAGS_BY_SUB_CATEGORY, nativeQuery = true)
        List<Object[]> findBySubCategory(@Param("subcategory")List<String> subcategory);
        
        @Query(value = FIND_TAGS_BY_CATEGORY, nativeQuery = true)
        List<Object[]> findByCategory(@Param("category")List<String> category);
        
        @Query(value = FIND_ALL_CATEGORIES, nativeQuery = true)
        List<String> findAllCategories();
        
        @Query(value = FIND_ALL_SUB_CATEGORIES, nativeQuery = true)
        List<String> findAllSubCategories();
        
}