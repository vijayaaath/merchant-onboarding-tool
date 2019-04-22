package com.crayondata.merchantonboarding.controller;

import java.util.Map;
import java.util.Set;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.crayondata.merchantonboarding.model.Category;
import com.crayondata.merchantonboarding.service.CategoryTagService;
import com.crayondata.merchantonboarding.utils.JsonUtils;

@Controller
public class CategoryTagController {
    
    @Autowired
    CategoryTagService categoryTagService;
    
    @Autowired
    JsonUtils jsonUtils;
        
    @RequestMapping(value = "api/categories", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getAllCategories(Pageable pageable){
        Page<Category> result = categoryTagService.findAllCategories(pageable);
        if(result != null)
            return new ResponseEntity<>(result, HttpStatus.OK);
        else
            return new ResponseEntity<>("No categories found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "api/subcategoriesByCategory", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getAllSubCategories(@RequestBody(required = false) JSONObject input){
        Map<String,Set<String>> categorySubcategoryMap = categoryTagService.getAllSubCategories(input);
        if(!categorySubcategoryMap.isEmpty())
            return new ResponseEntity<>(categorySubcategoryMap, HttpStatus.OK);
        else
            return new ResponseEntity<>("No subcategories found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "api/tagsByCategory", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getAllTagsBySubCategory(@RequestBody(required = false) JSONObject input){
        Set<String> tagSet = categoryTagService.getAllTags(input);
        if(tagSet != null && tagSet.size() > 0)
            return new ResponseEntity<>(jsonUtils.setArrayToValueLabel(tagSet), HttpStatus.OK);
        else
            return new ResponseEntity<>("No tags found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "api/tagsByCategoryName", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getAllTagsBySubCategoryName(@RequestBody(required = false) JSONObject input){
        Set<String> tagSet = categoryTagService.getAllTagsByCategory(input);
        if(tagSet != null && tagSet.size() > 0)
            return new ResponseEntity<>(jsonUtils.setArrayToValueLabel(tagSet), HttpStatus.OK);
        else
            return new ResponseEntity<>("No tags found", HttpStatus.NOT_FOUND);
    }
}
