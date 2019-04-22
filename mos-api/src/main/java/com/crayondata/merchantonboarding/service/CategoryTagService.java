package com.crayondata.merchantonboarding.service;

import java.util.Map;
import java.util.Set;

import org.json.simple.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.crayondata.merchantonboarding.model.Category;

public interface CategoryTagService {
    Page<Category> findAllCategories(Pageable pageable);
    Map<String,Set<String>> getAllSubCategories(JSONObject input);
    Set<String> getAllTags(JSONObject input);
    Set<String> getAllTagsByCategory(JSONObject input);
}
