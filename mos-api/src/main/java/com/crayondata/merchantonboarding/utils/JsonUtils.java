package com.crayondata.merchantonboarding.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class JsonUtils {
    private final ObjectMapper objectMapper;
    
    @Autowired
    public JsonUtils(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    
    public JSONObject objectArrayToIdName(List<Object[]> list){
        List<IdName> returnList = new ArrayList<>();
        if(list == null || list.isEmpty())
            return new JSONObject();
        for(Object[] obj : list){
        	if(obj[1] != null)
        		returnList.add(new IdName(Long.parseLong(obj[0].toString()),obj[1].toString()));
        }
        JSONObject jObj = new JSONObject();
        jObj.put("results", returnList);
        return jObj;
    }
    
    public JSONObject objectArrayToValueLabel(List<Object[]> list){
        List<ValueLabel> returnList = new ArrayList<>();
        if(list == null || list.isEmpty())
            return new JSONObject();
        for(Object[] obj : list){
        	if(obj[1] != null)
        		returnList.add(new ValueLabel(Long.parseLong(obj[0].toString()),obj[1].toString()));
        }
        JSONObject jObj = new JSONObject();
        jObj.put("results", returnList);
        return jObj;
    }
    
    public JSONArray setArrayToValueLabel(Set<String> set){
    	JSONArray jArray = new JSONArray();
        if(set == null || set.isEmpty())
            return new JSONArray();
        for(String str : set){
        	if(str != null){
        		JSONObject job = new JSONObject();
        		job.put("id", str);
        		job.put("text", str);
        		jArray.add(job);
        	}
        }
        
        return jArray;
    }
    
    public JSONObject objectArrayToIdNameSet(Set<Object[]> list){
        List<IdName> returnList = new ArrayList<>();
        if(list == null || list.isEmpty())
            return new JSONObject();
        for(Object[] obj : list){
        	if(obj[1] != null)
        		returnList.add(new IdName(Long.parseLong(obj[0].toString()),obj[1].toString()));
        }
        JSONObject jObj = new JSONObject();
        jObj.put("results", returnList);
        return jObj;
    }
    
    public JSONObject objectArrayToName(List<Object> list){
        List<String> returnList = new ArrayList<>();
        if(list == null || list.isEmpty())
            return new JSONObject();
        for(Object obj : list){
        	if(obj != null)
        		returnList.add(obj.toString());
        }
        JSONObject jObj = new JSONObject();
        jObj.put("results", returnList);
        return jObj;
    }
}
