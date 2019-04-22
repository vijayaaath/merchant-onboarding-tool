package com.crayondata.merchantonboarding.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.crayondata.merchantonboarding.enums.TagStatus;
import com.crayondata.merchantonboarding.model.Brand;
import com.crayondata.merchantonboarding.model.BrandResponse;
import com.crayondata.merchantonboarding.model.ErrorWarning;
import com.crayondata.merchantonboarding.model.ImageResponse;
import com.crayondata.merchantonboarding.model.Images;
import com.crayondata.merchantonboarding.model.Merchant;
import com.crayondata.merchantonboarding.model.Tenant;
import com.crayondata.merchantonboarding.repository.BrandRepository;
import com.crayondata.merchantonboarding.repository.MerchantRepository;
import com.crayondata.merchantonboarding.repository.OfferRepository;
import com.crayondata.merchantonboarding.repository.TenantRepository;
import com.crayondata.merchantonboarding.service.BrandService;
import com.crayondata.merchantonboarding.service.BrandsValidate;
import com.crayondata.merchantonboarding.utils.JsonUtils;

@Controller
public class BrandController {
	@Autowired
    private TenantRepository tenantRepository;
    @Autowired
    private MerchantRepository merchantRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private BrandService brandService;
    @Autowired
    private JsonUtils jsonUtils;
    
    @Value("${aws.brand.file.path:null}")
	public String awsbrandPath;
    
    @Value("${aws.domain.name:null}")
	public String awsDomainName;

    @RequestMapping(value = "/api/brands", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addBrands(@ModelAttribute Brand brand) throws Exception {
    	List<ErrorWarning> brandErrors = new ArrayList<ErrorWarning>();
    	BrandsValidate brandsValidate = new BrandsValidate();
    	Set<Images> imageList = new HashSet<>();
        String tenantName = brand.getTenantName();
        Long merchantId = brand.getMerchantId();
        Tenant tenant = tenantRepository.findByName(tenantName);
        Merchant merchant = merchantRepository.findByMerchantId(merchantId);
        if (tenant == null)
            return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
        else if (merchant == null) 
        	return new ResponseEntity("Merchant Not Found", HttpStatus.NOT_FOUND);
        brand.setTenant(tenant);
        brand.setMerchant(merchant);
        brand.setStatus("inactive");
        
        List<String> tags = brand.getTagsList();
        if(tags != null){
            StringBuilder sb = new StringBuilder();
            for (String tag : tags){
                sb.append(tag);
                sb.append("|");
            }
            brand.setTags(sb.toString());
        }
        List<String> subCategories = brand.getSubCategoryList();
        if(subCategories != null){
            StringBuilder sb = new StringBuilder();
            for (String sc : subCategories){
                sb.append(sc);
                sb.append("|");
            }
            brand.setSubCategories(sb.toString());
        }

        brandErrors = brandsValidate.brandValidate(brand);        
        if(!brandErrors.isEmpty())
        	return new ResponseEntity(brandErrors, HttpStatus.BAD_REQUEST);
        
        if(brand.getImage() != null){
        	try {
        		Long id = Long.parseLong(brandRepository.findLastId().toString());
        		imageList = brandService.uploadImages(brand.getImage(),"brand",id+1);
			} catch (Exception e) {
				e.printStackTrace();
			}
        	if(imageList != null)
        		brand.setImages(imageList);
        }
        
        Brand savedBrand = brandRepository.save(brand);
        return new ResponseEntity<>(savedBrand.getBrandId(), HttpStatus.OK);
    }

    @RequestMapping(value = "/api/brands/{id}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateBrands(@PathVariable(required = true) long id,
    		@ModelAttribute Brand brand) throws Exception {
    	List<ErrorWarning> brandErrors = new ArrayList<ErrorWarning>();
    	BrandsValidate brandsValidate = new BrandsValidate();
    	Set<Images> imageList = new HashSet<>();
        Brand brandRecord = brandRepository.findOne(id);
        if (brandRecord == null)
            return new ResponseEntity<>("Brand not found", HttpStatus.NOT_FOUND);
        else {
            String tenantName = brand.getTenantName();
            Long merchantId = brand.getMerchantId();
            if(tenantName != null){
            	Tenant tenant = tenantRepository.findByName(tenantName);
            	if (tenant == null)
                    return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
            	 brandRecord.setTenant(tenant);
            }
            if(merchantId != null){
            	 Merchant merchant = merchantRepository.findByMerchantId(merchantId);
            	 if (merchant == null) 
                 	return new ResponseEntity("Merchant Not Found", HttpStatus.NOT_FOUND);
            	 brandRecord.setMerchant(merchant);
            }
            if(brand.getTagsList() != null){
                List<String> tags = brand.getTagsList();
                StringBuilder sb = new StringBuilder();
                for (String tag : tags){
                    sb.append(tag);
                    sb.append("|");
                }
                brand.setTags(sb.toString());
            }
            if(brand.getSubCategoryList() != null){
                List<String> subCategories = brand.getSubCategoryList();
                StringBuilder sb = new StringBuilder();
                for (String sc : subCategories){
                    sb.append(sc);
                    sb.append("|");
                }
                brand.setSubCategories(sb.toString());   
            }
            brandErrors = brandsValidate.brandValidate(brand);        
            if(!brandErrors.isEmpty())
            	return new ResponseEntity(brandErrors, HttpStatus.BAD_REQUEST);
            
            if(brand.getImage() != null){
            	try {
            		imageList = brandService.uploadImages(brand.getImage(),"brand",id);
    			} catch (Exception e) {
    				e.printStackTrace();
    			}
            	if(imageList != null)
            		brandRecord.setImages(imageList);
            }
            if(brand.getTags() != null)
            	brandRecord.setTags(brand.getTags());
            if(brand.getSubCategories() != null)
            	brandRecord.setSubCategories(brand.getSubCategories());
            if(brand.getName() != null)
            	brandRecord.setName(brand.getName());
            if(brand.getUrl() != null)
            	brandRecord.setUrl(brand.getUrl());
            if(brand.getPublishWithoutOffers() != null)
            	brandRecord.setPublishWithoutOffers(brand.getPublishWithoutOffers());
            if(brand.getCategory() != null)
            	brandRecord.setCategory(brand.getCategory());
            if(brand.getDescription() != null)
            	brandRecord.setDescription(brand.getDescription());
            if(brand.getEmail() != null)
            	brandRecord.setEmail(brand.getEmail());
            if(brand.getStores() != null)
            	brandRecord.setStores(brand.getStores());
            if(brand.getCdfBrandId() != null)
            	brandRecord.setCdfBrandId(brand.getCdfBrandId());
            
            Brand savedBrand = brandRepository.save(brandRecord);
            return new ResponseEntity<>(savedBrand.getBrandId(), HttpStatus.OK);
        }
    }
    
    @RequestMapping(value = "/api/brands/name/{name}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateBrandsByName(@PathVariable(required = true) String name,
			@ModelAttribute Brand brand) {
		Set<Images> imageList = new HashSet<>();
		Brand savedBrand = new Brand();
		List<Brand> brandRecords = brandRepository.findBrandsByName(name);
		if (brandRecords.size() == 0)
			return new ResponseEntity<>("Brand not found", HttpStatus.NOT_FOUND);
		else {
			for (Brand brandRecord : brandRecords) {
				String tenantName = brand.getTenantName();
				Long merchantId = brand.getMerchantId();
				if (tenantName != null) {
					Tenant tenant = tenantRepository.findByName(tenantName);
					if (tenant == null)
						return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
					brandRecord.setTenant(tenant);
				}
				if (merchantId != null) {
					Merchant merchant = merchantRepository.findByMerchantId(merchantId);
					if (merchant == null)
						return new ResponseEntity("Merchant Not Found", HttpStatus.NOT_FOUND);
					brandRecord.setMerchant(merchant);
				}
				if (brand.getImage() != null) {
					try {
						imageList = brandService.uploadImages(brand.getImage(), "brand", brandRecord.getBrandId());
					} catch (Exception e) {
						e.printStackTrace();
					}
					if (imageList != null)
						brandRecord.setImages(imageList);
				}
				if (brand.getName() != null)
					brandRecord.setName(brand.getName());
				if (brand.getUrl() != null)
					brandRecord.setUrl(brand.getUrl());
				if (brand.getPublishWithoutOffers() != null)
					brandRecord.setPublishWithoutOffers(brand.getPublishWithoutOffers());
				if (brand.getCategory() != null)
					brandRecord.setCategory(brand.getCategory());
				if (brand.getDescription() != null)
					brandRecord.setDescription(brand.getDescription());
				 if(brand.getStores() != null)
		            	brandRecord.setStores(brand.getStores());
				 if(brand.getCdfBrandId() != null)
		            	brandRecord.setCdfBrandId(brand.getCdfBrandId());
				if (brand.getTagsList() != null) {
					List<String> tags = brand.getTagsList();
					StringBuilder sb = new StringBuilder();
					for (String tag : tags) {
						sb.append(tag);
						sb.append("|");
					}
					brandRecord.setTags(sb.toString());
				}
				if (brand.getSubCategoryList() != null) {
					List<String> subCategories = brand.getSubCategoryList();
					StringBuilder sb = new StringBuilder();
					for (String sc : subCategories) {
						sb.append(sc);
						sb.append("|");
					}
					brandRecord.setSubCategories(sb.toString());
				}
				if (brand.getEmail() != null)
					brandRecord.setEmail(brand.getEmail());
				savedBrand = brandRepository.save(brandRecord);
			}
			return new ResponseEntity<>(savedBrand.getName(), HttpStatus.OK);
		}
	}
    
    @RequestMapping(value = "/api/brands/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Object> deleteBrand(@PathVariable(required=true) long id)
    {
        Brand brandRecord =  brandRepository.findOne(id);
        if(brandRecord != null) {
        	brandRepository.delete(brandRecord);
            return  new ResponseEntity<>("Brand deleted successfully", HttpStatus.OK);
        }
        else
            return  new ResponseEntity<>("Brand not found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getAllBrands(Pageable pageable){
        Page<Brand> brands = brandRepository.findAll(pageable);
        if(brands != null)
            return new ResponseEntity<>(brands, HttpStatus.OK);
        else
            return new ResponseEntity<>("No brands found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getBrandsById(@PathVariable(required=true) long id){
    	BrandResponse brandResponse = new BrandResponse();
        Brand brands = brandRepository.findByBrandId(id);
        if(brands == null)
        	return new ResponseEntity<>("No brands found", HttpStatus.NOT_FOUND);
        Object outletCount;
        Object activeOfferCount;
        Object pendingOfferCount;
        List<Object[]> objects = new ArrayList<>();
        Map<Object,List<Object>> cityCountryMap = new HashMap<Object,List<Object>>();
        Set<Images> images = brands.getImages();
        Set<ImageResponse> returnImages = new HashSet<>();
        
        for(Images image : images){
        	ImageResponse imgResponse = new ImageResponse();
        	String imageName = image.getImage();
			if (imageName != null && !imageName.isEmpty()) {
				String imageUrl = awsDomainName + awsbrandPath + imageName;
				imgResponse.setId(image.getId());
				imgResponse.setImage(imageUrl);
				returnImages.add(imgResponse);
			}
        }
        brands.setImageResponse(returnImages);
        
        String tags = brands.getTags();
        if(tags != null){
            String[] tagList = tags.split("\\s*\\|\\s*");
            brands.setTagsList(Arrays.asList(tagList));
        }
        String subCategories = brands.getSubCategories(); 
        if(subCategories != null){
            String[] subCategoryList = subCategories.split("\\s*\\|\\s*",0);
            brands.setSubCategoryList(Arrays.asList(subCategoryList));
        }
       
        outletCount = brandRepository.findOutletCountByBrand(id);
        activeOfferCount = brandRepository.findActiveOffersByBrand(id);
        pendingOfferCount = brandRepository.findPendingOffersByBrand(id);
        objects = brandRepository.findCityAndCountryByBrand(id);
        for(Object[] object : objects){
        	if(cityCountryMap.containsKey(object[1])){
        		List<Object> val = cityCountryMap.get(object[1]);
        		val.add(object[0]);
        		cityCountryMap.put(object[1],val);
        	} else{
        		List<Object> val = new ArrayList<>();
        		val.add(object[0]);
        		cityCountryMap.put(object[1],val);
        	}
        }
        brandResponse.setBrand(brands);
        brandResponse.setOutletCount(outletCount);
        brandResponse.setActiveOfferCount(activeOfferCount);
        brandResponse.setPendingOfferCount(pendingOfferCount);
        brandResponse.setCountryCityMap(cityCountryMap);
        return new ResponseEntity<>(brandResponse, HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/brands/searchByMerchantAndBrand", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getAllBrands(@RequestParam(value="merchantId",required=true) long merchantId , @RequestParam(value="brandName",required=true) String brandName){
    	Brand brands = brandRepository.findBrandsByNameAndMerchant(brandName,merchantId);
        if(brands != null)
            return new ResponseEntity<>(brands, HttpStatus.OK);
        else
            return new ResponseEntity<>("No brands found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/search", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getBrandsByName(@RequestParam(value="brandName",required=true) String brandName){
    	BrandResponse brandResponse = new BrandResponse();
        List<Brand> brands = brandRepository.findBrandsByName(brandName);
        Brand brand = new Brand();
        if(brands == null)
        	return new ResponseEntity<>("No brands found", HttpStatus.NOT_FOUND);
        else
        	brand = brands.get(0);
        Object outletCount;
        Object activeOfferCount;
        Object pendingOfferCount;
        List<Object[]> objects = new ArrayList<>();
        Map<Object,List<Object>> cityCountryMap = new HashMap<Object,List<Object>>();
        Set<Images> images = brand.getImages();
        Set<ImageResponse> returnImages = new HashSet<>();
        for(Images image : images){
        	ImageResponse imgResponse = new ImageResponse();
        	String imageName = image.getImage();
        	if (imageName != null && !imageName.isEmpty()) {
				String imageUrl = awsDomainName + awsbrandPath + imageName;
				imgResponse.setId(image.getId());
				imgResponse.setImage(imageUrl);
				returnImages.add(imgResponse);
			}
        }
        brand.setImageResponse(returnImages);
        
        String tags = brand.getTags();
        if(tags != null){
            String[] tagList = tags.split("\\s*\\|\\s*");
            brand.setTagsList(Arrays.asList(tagList));
        }
        String subCategories = brand.getSubCategories(); 
        if(subCategories != null){
            String[] subCategoryList = subCategories.split("\\s*\\|\\s*",0);
            brand.setSubCategoryList(Arrays.asList(subCategoryList));
        }
       
        outletCount = brandRepository.findOutletCountByBrandName(brand.getName());
        activeOfferCount = brandRepository.findActiveOffersByBrandName(brand.getName());
        pendingOfferCount = brandRepository.findPendingOffersByBrandName(brand.getName());
        objects = brandRepository.findCityAndCountryByBrandName(brand.getName());
        for(Object[] object : objects){
        	if(cityCountryMap.containsKey(object[1])){
        		List<Object> val = cityCountryMap.get(object[1]);
        		val.add(object[0]);
        		cityCountryMap.put(object[1],val);
        	} else{
        		List<Object> val = new ArrayList<>();
        		val.add(object[0]);
        		cityCountryMap.put(object[1],val);
        	}
        }
        brandResponse.setBrand(brand);
        brandResponse.setOutletCount(outletCount);
        brandResponse.setActiveOfferCount(activeOfferCount);
        brandResponse.setPendingOfferCount(pendingOfferCount);
        brandResponse.setCountryCityMap(cityCountryMap);
        return new ResponseEntity<>(brandResponse, HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/brands/search/findAllBrandNames", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findAllBrandNames(){
        List<Object[]> list = brandRepository.findAllBrandNames();
        if(list != null)
            return new ResponseEntity<>(list, HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/search/findByName{?name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findByName(@RequestParam(required=true) String name){
        List<Object[]> list = brandRepository.findByName(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/name", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findBrandByName(@RequestParam(required=true) String name){
    	if(name.length() < 2){
    		return new ResponseEntity<>(new JSONObject(), HttpStatus.EXPECTATION_FAILED);
    	}
        List<Brand> list = brandRepository.findBrandsLikeName(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(list, HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/search/findByMerchantId/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findByMerchantId(@PathVariable(required=true) long id){
        List<Object[]> list = brandRepository.findByMerchantId(id);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToValueLabel(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/search/findDistinctByMerchantId/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findDistinctByMerchantId(@PathVariable(required=true) long id){
        List<Object> list = brandRepository.findDistinctByMerchantId(id);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/search/findDistinctBrands", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findDistinctBrands(){
        List<Object> list = brandRepository.findDistinctBrand();
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/count/{id}", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject getCountByBrand(@PathVariable(required=true) long id, @RequestParam(value="type",required=true) String type){
    	Object retCount;
    	JSONObject jObject = new JSONObject();
    	if(type.equals("outlets")){
    		retCount = brandRepository.findOutletCountByBrand(id);
    		jObject.put("outletsCount", retCount);
    	} else if(type.equals("activeOffers")){
    		retCount = brandRepository.findActiveOffersByBrand(id);
    		jObject.put("activeOffersCount", retCount);
    	}else if(type.equals("pendingOffers")){
    		retCount = brandRepository.findPendingOffersByBrand(id);
    		jObject.put("pendingOffersCount", retCount);
    	}
    	return jObject;
    }
    
    @RequestMapping(value = "/api/brands/country/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Map<Object,List<Object>> getCountryCity(@PathVariable(required=true) long id){
    	Map<Object,List<Object>> cityCountryMap = new HashMap<Object,List<Object>>();
    	List<Object[]> objects = brandRepository.findCityAndCountryByBrand(id);
    	List<Object> val= null;
        for(Object[] object : objects){
        	if(cityCountryMap.containsKey(object[1])){
        		val = cityCountryMap.get(object[1]);
        		val.add(object[0]);
        		cityCountryMap.put(object[1],val);
        	} else{
        		val = new ArrayList<>();
        		val.add(object[0]);
        		cityCountryMap.put(object[1],val);
        	}
        }
    	return cityCountryMap;
    }
    
    @RequestMapping(value = "/api/brands/search/country", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,List<String>> findExistingCountry(){
        Map<String,List<String>> countryMap = new HashMap<String,List<String>>();
        List<String> countries = brandRepository.findExistingCountry();
        countryMap.put("country", countries);    
        return countryMap;
    }
    
    @RequestMapping(value = "/api/brands/search/city{?name}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,List<String>> findExistingCity(@RequestParam(required=true) String name){
        Map<String,List<String>> cityMap = new HashMap<String,List<String>>();
        List<String> cities = brandRepository.findExistingCity(name);
        cityMap.put("city", cities);    
        return cityMap;
    }
    
    @RequestMapping(value = "/api/brands/search/country/all", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,List<String>> findAllCountry(){
        Map<String,List<String>> countryMap = new HashMap<String,List<String>>();
        List<String> countries = brandRepository.findAllCountry();
        countryMap.put("country", countries);    
        return countryMap;
    }
    
    @RequestMapping(value = "/api/brands/search/city/all{?name}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,List<String>> findAllCity(@RequestParam(required=true) String name){
        Map<String,List<String>> cityMap = new HashMap<String,List<String>>();
        List<String> cities = brandRepository.findAllCity(name);
        cityMap.put("city", cities);    
        return cityMap;
    }
    
    @RequestMapping(value = "/api/brands/search/findBrand/{name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findBrand(@PathVariable(required=true) String name){
       List<Object[]> list = new ArrayList<>();
       String[] inputs = name.split(",");
       if(inputs.length == 1){
    	   list = brandRepository.findBrandByCountry(inputs[0]);
       } else if(inputs.length == 2){
    	   list = brandRepository.findBrandByCity(inputs[0]);
       }
       if(list != null && list.size() > 0)
           return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
       else
           return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    
    @RequestMapping(value = "/api/brands/search/findBrandByCountry{?name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findBrandByCountry(@RequestParam(required=true) String name){
        List<Object[]> list = brandRepository.findBrandByCountry(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/search/findBrandByCity{?name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findBrandByCity(@RequestParam(required=true) String name){
        List<Object[]> list = brandRepository.findBrandByCity(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/brands/findIfBrandExistsForMerchant", method = RequestMethod.GET)
    @ResponseBody
    public boolean ifBrandExistsForMerchant(@RequestParam(value="merchantId",required=true) long merchantId , @RequestParam(value="brandName",required=true) String brandName){
    	Brand brands = brandRepository.findBrandsByNameAndMerchant(brandName,merchantId);
        if(brands != null)
            return true;
        else
            return false;
    }
    
    @RequestMapping(value = "/api/brands/summary", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> brandSummary(){
    	List<Object[]> objects = brandRepository.brandSummary();
    	List<JSONObject> jObjects = new ArrayList<JSONObject>();
    	for(Object[] object : objects){
    		JSONObject jObject = new JSONObject();
    		jObject.put("brandId", object[0]);
    		jObject.put("brandName", object[1]);
    		jObject.put("outletCount", object[2]);
    		jObject.put("category", object[3]);
    		jObject.put("offerCount", object[4]);
    		jObject.put("cityCount", object[5]);
    		jObjects.add(jObject);
    	}
    	return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/brands/summary/name/", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> brandSummaryByName(){
    	List<Object[]> objects = brandRepository.brandSummaryByBrandName();
    	List<JSONObject> jObjects = new ArrayList<JSONObject>();
    	for(Object[] object : objects){
    		JSONObject jObject = new JSONObject();
    		//jObject.put("brandId", object[0]);
    		jObject.put("brandName", object[0]);
    		jObject.put("outletCount", object[1]);
    		jObject.put("category", object[2]);
    		jObject.put("offerCount", object[3]);
    		jObject.put("cityCount", object[4]);
    		jObjects.add(jObject);
    	}
    	return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/brands/summary/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> brandSummaryByMerchant(@PathVariable(required=true) long id){
        List<Object[]> objects = brandRepository.brandSummaryByMerchant(id);
        List<JSONObject> jObjects = new ArrayList<JSONObject>();
        for(Object[] object : objects){
            JSONObject jObject = new JSONObject();
            jObject.put("brandId", object[0]);
            jObject.put("brandName", object[1]);
            jObject.put("cityCount", object[2]);
            jObject.put("outletCount", object[3]);
            jObject.put("category", object[4]);
            jObject.put("tagsBoolean", object[5]);
            jObject.put("status", object[6]);
            jObject.put("curateFlag", object[7]);
            jObjects.add(jObject);
        }
        return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
   
    @RequestMapping(value = "/api/brands/summary/name/merchant", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> brandSummaryByMerchantId(@RequestParam(value="merchantId",required=true) long id){
        List<Object[]> objects = brandRepository.brandSummaryByNameMerchant(id);
        List<JSONObject> jObjects = new ArrayList<JSONObject>();
        for(Object[] object : objects){
            JSONObject jObject = new JSONObject();
            //jObject.put("brandId", object[0]);
            jObject.put("brandName", object[0]);
            jObject.put("outletCount", object[1]);
            jObject.put("category", object[2]);
            jObject.put("offerCount", object[3]);
            jObject.put("cityCount", object[4]);
            jObjects.add(jObject);
        }
        return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/brands/cityCountry", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getCountryCity(){
        List<Object[]> cityCountry = brandRepository.findCityAndCountry();
        List<Object> country = brandRepository.findCountry();
        List<String> val= new ArrayList<>();
        for(Object[] object : cityCountry){
        	if(object[0] != null && !object[0].toString().isEmpty()){
        		//if(!object[1].toString().equalsIgnoreCase("singapore"))
        		val.add(object[0].toString()+","+object[1].toString());
        	}
        }
        for(Object object : country){
        	if(object != null)
        		val.add(object.toString());
        }
        return val;
    }
    
    @RequestMapping(value = "/api/brands/cityCountry/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getCountryCityByBrandId(@PathVariable(required=true) long id){
        List<Object[]> cityCountry = brandRepository.findCityAndCountryByBrand(id);
        List<Object> country = brandRepository.findCountryById(id);
        List<String> val= new ArrayList<>();
        for(Object[] object : cityCountry){
        	if(object[0] != null && !object[0].toString().isEmpty())
        		val.add(object[0].toString()+","+object[1].toString());
        }
        for(Object object : country){
        	if(object != null)
        		val.add(object.toString());
        }
        return val;
    }
    
    @RequestMapping(value = "/api/brands/closeBrandById", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> brandCloseById(@RequestParam(value="brandId",required=true) long brandId){
    	Brand brand = brandRepository.findOne(brandId);
    	long merchantId = brand.getMerchant().getMerchantId();
    	offerRepository.updateBrandStatus("closed",brandId);
    	brandRepository.updateOutletStatusForBrand("closed", brandId);
    	brandRepository.updateOfferStatusForBrand("cancelled", brandId);
    	Object obj = offerRepository.findIfMerchantIsActive(merchantId);
    	if(obj == null){
			offerRepository.updateMerchantStatus("inactive",merchantId);
		}
    	return new ResponseEntity<>("Brand closed",HttpStatus.OK);
    	
    }
    
    @RequestMapping(value = "/api/brands/closeBrandByName", method = RequestMethod.GET)
    @ResponseBody
	public ResponseEntity<Object> brandCloseByName(
			@RequestParam(value = "brandName", required = true) String brandName) {
		List<Brand> brands = brandRepository.findBrandsByName(brandName);
		offerRepository.updateBrandStatusByName("closed", brandName);
		brandRepository.updateOutletStatusForBrandName("closed", brandName);
    	brandRepository.updateOfferStatusForBrandName("cancelled", brandName);
		for (Brand brand : brands) {
			if (brand.getMerchantId() != null) {
				Object obj = offerRepository.findIfMerchantIsActive(brand.getMerchantId());
				if (obj == null) {
					offerRepository.updateMerchantStatus("inactive", brand.getMerchantId());
				}
			}
		}
		return new ResponseEntity<>("Brands closed", HttpStatus.OK);

	}
    
    @RequestMapping(value = "/api/brands/categories", method = RequestMethod.GET)
    @ResponseBody
	public ResponseEntity<Object> getCategoriesFromBrands() {
		List<Object> categories = brandRepository.findDistinctCategory();
		return new ResponseEntity<>(categories, HttpStatus.OK);

	}
    
    @RequestMapping(value = "/api/brands/byCategory", method = RequestMethod.GET)
    @ResponseBody
	public ResponseEntity<Object> getBrandsByCategory(@RequestParam(value = "categoryName", required = true) String categoryName, Pageable pageable) {
		Page<Brand> categories = brandRepository.findByCategory(categoryName,pageable);
		return new ResponseEntity<>(categories, HttpStatus.OK);

	}
    
    @RequestMapping(value = "/api/brands/getUserActivity", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Brand>> getUserActivity(@RequestParam(value = "userName", required = true) String userName) {
        List<Brand> userActivities = brandRepository.findUserActivity(userName);
        return new ResponseEntity<>(userActivities, HttpStatus.OK);

    }
    
    @RequestMapping(value = "/api/brands/getClosedBrands", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<Brand>> getClosedBrands() {
        List<Brand> closedBrands = brandRepository.findClosedBrands();
        return new ResponseEntity<>(closedBrands, HttpStatus.OK);
    }
    
    @PostMapping("/api/brands/upload")
    @ResponseBody
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile uploadfile) throws IOException {
        BufferedReader fileReader = new BufferedReader(
                new InputStreamReader(uploadfile.getInputStream(), "UTF-8"));
        List<Brand> brands = fileReader.lines().skip(1).map(line -> {
            String[] rowSplt = line.split("\t");
            String tagStatus = TagStatus.TAGGED.name();
            String categoryName = brandRepository.findCategoryName(rowSplt[0]);
            List<String> subCategories = brandRepository.findSubCategory(categoryName);
            StringBuilder subCategory = new StringBuilder();
            if (subCategories != null) {
                for (String sc : subCategories) {
                    subCategory.append(sc);
                    subCategory.append("|");
                }
            }
            Merchant merchant = merchantRepository
                    .findByMerchantId(merchantRepository.findIdByCdfMerchantId(rowSplt[4]));
            Tenant tenant = tenantRepository.findByName(rowSplt[5]);
            Set<Images> images = new HashSet<>();
            Images image = new Images(rowSplt[7]);
            images.add(image);

            if (rowSplt[2] == null || rowSplt[2].isEmpty()) {
                tagStatus = TagStatus.UNTAGGED.name();
            }

            return new Brand(categoryName, subCategory.toString().substring(0, subCategory.length() - 2),
                    rowSplt[1], rowSplt[2], rowSplt[3], merchant, tenant, rowSplt[6], images, tagStatus);
        }).collect(Collectors.toList());
        brands.forEach(brand -> brandRepository.save(brand));
        fileReader.close();
        return new ResponseEntity<>("Brand file successfully uploaded", HttpStatus.OK);
    }
}