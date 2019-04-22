package com.crayondata.merchantonboarding.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.crayondata.merchantonboarding.model.Category;
import com.crayondata.merchantonboarding.repository.CategoryRepository;
import com.crayondata.merchantonboarding.repository.SubCategoryRepository;
import com.crayondata.merchantonboarding.repository.TagRepository;
import com.crayondata.merchantonboarding.service.CategoryTagService;

@Service
public class CategoryTagServiceImpl implements CategoryTagService{
    
    @Autowired
    TagRepository tagRepository;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    SubCategoryRepository subCategoryRepository;
    
    @Override
    public Page<Category> findAllCategories(Pageable pageable){
        return categoryRepository.findAll(pageable);
    }
    
    @Override
    public Map<String,Set<String>> getAllSubCategories(JSONObject input){
        List<Object[]> result = null;
        Map<String,Set<String>> categorySubcategoryMap = new HashMap<>();
        List<String> categories = new ArrayList<String>();
        if(input == null){
            categories = subCategoryRepository.findAllCategories();
        }
        else{
            categories = (List<String>) input.get("category");
        }
        result = subCategoryRepository.findByCategory(categories);
        for(Object[] obj : result){
            String key = obj[0].toString();
            String value = obj[1].toString();
            if(categorySubcategoryMap.containsKey(key)){
                 categorySubcategoryMap.get(key).add(value);
            }
             else{
                 Set<String> values = new HashSet<>();
                 values.add(value);
                 categorySubcategoryMap.put(key, values);
             }
         }
        return categorySubcategoryMap;
    }
    
    @Override
    public Set<String> getAllTags(JSONObject input){
        List<Object[]> result = null;
        List<String> subcategory = new ArrayList<String>();
        if(input == null){
        	subcategory = tagRepository.findAllSubCategories();
        }
        else{
        	subcategory = (List<String>) input.get("category");
        }
        result = tagRepository.findBySubCategory(subcategory);
        Set<String> tags = new HashSet<>();
        for(Object[] obj : result){
            String[] values = obj[1].toString().split(",");
            for(String value : values){
            	tags.add(value.trim());
            }
        }   
        return tags;
    }
    
    @Override
    public Set<String> getAllTagsByCategory(JSONObject input){
        List<Object[]> result = null;
        List<String> category = new ArrayList<String>();
        if(input == null){
        	category = tagRepository.findAllCategories();
        }
        else{
        	category = (List<String>) input.get("category");
        }
        result = tagRepository.findByCategory(category);
        Set<String> tags = new HashSet<>();
        for(Object[] obj : result){
            String[] values = obj[1].toString().split(",");
            for(String value : values){
            	tags.add(value.trim());
            }
        }   
        return tags;
    }
}
