package com.crayondata.merchantonboarding.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.crayondata.merchantonboarding.model.Category;

public interface CategoryRepository extends PagingAndSortingRepository<Category, String>{
    Category findByCategoryName(@Param("id") String id);
}