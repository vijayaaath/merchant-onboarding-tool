package com.crayondata.merchantonboarding.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.aspectj.weaver.ast.HasAnnotation;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.crayondata.merchantonboarding.enums.OfferStatus;
import com.crayondata.merchantonboarding.model.Address;
import com.crayondata.merchantonboarding.model.Brand;
import com.crayondata.merchantonboarding.model.BrandByCityRequest;
import com.crayondata.merchantonboarding.model.ErrorWarning;
import com.crayondata.merchantonboarding.model.Images;
import com.crayondata.merchantonboarding.model.Merchant;
import com.crayondata.merchantonboarding.model.Offer;
import com.crayondata.merchantonboarding.model.OpeningHours;
import com.crayondata.merchantonboarding.model.Outlet;
import com.crayondata.merchantonboarding.model.Tenant;
import com.crayondata.merchantonboarding.repository.AddressRepository;
import com.crayondata.merchantonboarding.repository.BrandRepository;
import com.crayondata.merchantonboarding.repository.MerchantRepository;
import com.crayondata.merchantonboarding.repository.OfferRepository;
import com.crayondata.merchantonboarding.repository.OpeningHoursRepository;
import com.crayondata.merchantonboarding.repository.OutletRepository;
import com.crayondata.merchantonboarding.repository.TenantRepository;
import com.crayondata.merchantonboarding.service.AddressValidate;
import com.crayondata.merchantonboarding.service.OutletsValidate;
import com.crayondata.merchantonboarding.utils.JsonUtils;

@Controller
public class OutletController {
	@Autowired
    private TenantRepository tenantRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private MerchantRepository merchantRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private OutletRepository outletRepository;
    @Autowired
    private OpeningHoursRepository openingHoursRepository;
    @Autowired
    private JsonUtils jsonUtils;
    
     
    @RequestMapping(value = "/api/outlets", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addOutlets(
            @RequestBody(required=true) Outlet outlet) throws Exception
    {   
    	OutletsValidate outletsValidate = new OutletsValidate();
    	AddressValidate addressValidate = new AddressValidate();
    	List<ErrorWarning> addrErrWarns = new ArrayList<>();
    	List<ErrorWarning> outletErrWarns = new ArrayList<>();
    	List<ErrorWarning> errWarns = new ArrayList<>();
        String tenantName = outlet.getTenantName();
        Long brandId = outlet.getBrandId();
        Tenant tenant = tenantRepository.findByName(tenantName);
        Brand brand = brandRepository.findByBrandId(brandId);
        
        if(tenant == null)
            return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
        else if(brand == null)
            return new ResponseEntity("Brand Not Found", HttpStatus.NOT_FOUND);
        
        List<String> uniqOutletQualitiesList = outlet.getUniqOutletQualitiesList();
        if(uniqOutletQualitiesList != null){
            StringBuilder sb = new StringBuilder();
            for (String uniq : uniqOutletQualitiesList){
                sb.append(uniq);
                sb.append("|");
            }
            outlet.setUniqOutletQualities(sb.toString());
        }
                
        outlet.setTenant(tenant);
        outlet.setBrand(brand);
        outlet.setMerchant(brand.getMerchant());
        outlet.setStatus("inactive");
        if(outlet.getAddress() != null){
        	addrErrWarns = addressValidate.addressValidate(outlet.getAddress());
        	errWarns.addAll(addrErrWarns);
        }
        outletErrWarns = outletsValidate.outletValidate(outlet);
        errWarns.addAll(outletErrWarns);
        if(!errWarns.isEmpty())
        	return new ResponseEntity(errWarns, HttpStatus.BAD_REQUEST);
        Outlet savedOutlet = outletRepository.save(outlet);
        return new ResponseEntity<>(savedOutlet.getOutletId(), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/outlets/addByBrandName", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addOutletsByBrandName(
            @RequestBody(required=true) Outlet outlet) throws Exception
    {   
    	OutletsValidate outletsValidate = new OutletsValidate();
    	AddressValidate addressValidate = new AddressValidate();
    	List<ErrorWarning> addrErrWarns = new ArrayList<>();
    	List<ErrorWarning> outletErrWarns = new ArrayList<>();
    	List<ErrorWarning> errWarns = new ArrayList<>();
        String tenantName = outlet.getTenantName();
        //String brandName = outlet.getBrandName();
        //Long brandId = outlet.getBrandId();
        Tenant tenant = tenantRepository.findByName(tenantName);
        //Brand brand = brandRepository.findByBrandId(brandId);
        
        if(tenant == null)
            return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
        
        
        List<String> uniqOutletQualitiesList = outlet.getUniqOutletQualitiesList();
        if(uniqOutletQualitiesList != null){
            StringBuilder sb = new StringBuilder();
            for (String uniq : uniqOutletQualitiesList){
                sb.append(uniq);
                sb.append("|");
            }
            outlet.setUniqOutletQualities(sb.toString());
        }
                
        outlet.setTenant(tenant);
        outlet.setStatus("inactive");
        if(outlet.getAddress() != null){
        	addrErrWarns = addressValidate.addressValidate(outlet.getAddress());
        	errWarns.addAll(addrErrWarns);
        }
        outletErrWarns = outletsValidate.outletValidate(outlet);
        errWarns.addAll(outletErrWarns);
        if(!errWarns.isEmpty())
        	return new ResponseEntity(errWarns, HttpStatus.BAD_REQUEST);
        Outlet savedOutlet = outletRepository.save(outlet);
        return new ResponseEntity<>(savedOutlet.getOutletId(), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/outlets/{id}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateOutlets(@PathVariable(required=true) long id, @RequestBody(required=true) Outlet outlet) throws Exception
    {
    	OutletsValidate outletsValidate = new OutletsValidate();
    	AddressValidate addressValidate = new AddressValidate();
    	List<ErrorWarning> addrErrWarns = new ArrayList<>();
    	List<ErrorWarning> outletErrWarns = new ArrayList<>();
    	List<ErrorWarning> errWarns = new ArrayList<>();
        Outlet outletRecord =  outletRepository.findOne(id);
        if(outletRecord == null)
            return  new ResponseEntity<>("Outlet not found", HttpStatus.NOT_FOUND);
        else {
            String tenantName = outlet.getTenantName();
            Long brandId = outlet.getBrandId();
            
            if(tenantName != null){
            	Tenant tenant = tenantRepository.findByName(tenantName);
            	if(tenant == null)
                    return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
            	outletRecord.setTenant(tenant);
            }
            if(brandId != null){
            	Brand brand = brandRepository.findByBrandId(brandId);
            	if(brand == null)
                    return new ResponseEntity("Brand Not Found", HttpStatus.NOT_FOUND);
            	outletRecord.setBrand(brand);
            	outlet.setMerchant(brand.getMerchant());
            }
            if(outlet.getAddress() != null){
            	addrErrWarns = addressValidate.addressValidate(outlet.getAddress());
            	errWarns.addAll(addrErrWarns);
            }
            outletErrWarns = outletsValidate.outletValidate(outlet);
            errWarns.addAll(outletErrWarns);
            if(!errWarns.isEmpty())
            	return new ResponseEntity(errWarns, HttpStatus.BAD_REQUEST);
            
            if(outlet.getLocationId() != null)
            	outletRecord.setLocationId(outlet.getLocationId());
            List<String> uniqOutletQualitiesList = outlet.getUniqOutletQualitiesList();
            if(uniqOutletQualitiesList != null){
                StringBuilder sb = new StringBuilder();
                for (String uniq : uniqOutletQualitiesList){
                    sb.append(uniq);
                    sb.append("|");
                }
                outlet.setUniqOutletQualities(sb.toString());
            }
            if(outlet.getPhone() != null)
            	outletRecord.setPhone(outlet.getPhone());
            if(outlet.getUrl() != null)
            	outletRecord.setUrl(outlet.getUrl());
            if(outlet.getBrandName() != null)
            	outletRecord.setBrandName(outlet.getBrandName());
            if(outlet.getAddress() != null){
            	Address address = new Address();
            	address.setBuildingName(outlet.getAddress().getBuildingName());
            	address.setCityName(outlet.getAddress().getCityName());
            	address.setPostalCode(outlet.getAddress().getPostalCode());
            	address.setStreetName(outlet.getAddress().getStreetName());
            	address.setStreetNo(outlet.getAddress().getStreetNo());
            	address.setUnitNo(outlet.getAddress().getUnitNo());
            	address.setFloor(outlet.getAddress().getFloor());
            	address.setRoadName1(outlet.getAddress().getRoadName1());
            	address.setRoadName2(outlet.getAddress().getRoadName2());
            	address.setRoadName2(outlet.getAddress().getRoadName2());
            	address.setLocality(outlet.getAddress().getLocality());
            	address.setCountry(outlet.getAddress().getCountry());
            	outletRecord.setAddress(address);
            }
            if(outlet.getOpeningHours() != null){
            	OpeningHours openingHours = new OpeningHours();
            	openingHours.setMonday(outlet.getOpeningHours().getMonday());
            	openingHours.setTuesday(outlet.getOpeningHours().getTuesday());
            	openingHours.setWednesday(outlet.getOpeningHours().getWednesday());
            	openingHours.setThursday(outlet.getOpeningHours().getThursday());
            	openingHours.setFriday(outlet.getOpeningHours().getFriday());
            	openingHours.setSaturday(outlet.getOpeningHours().getSaturday());
            	openingHours.setSunday(outlet.getOpeningHours().getSunday());
            	outletRecord.setOpeningHours(openingHours);
            }
            Outlet savedOutlet = outletRepository.save(outletRecord);
            return new ResponseEntity<>(savedOutlet.getOutletId(), HttpStatus.OK);
        }
    }
    
    @RequestMapping(value = "/api/outlets/updateByBrandName", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateOutletsByBrandName(@RequestParam(value="brandName",required=true) String brandName, @RequestBody(required=true) Outlet outlet) throws Exception
	{
    	OutletsValidate outletsValidate = new OutletsValidate();
    	AddressValidate addressValidate = new AddressValidate();
    	List<ErrorWarning> addrErrWarns = new ArrayList<>();
    	List<ErrorWarning> outletErrWarns = new ArrayList<>();
    	List<ErrorWarning> errWarns = new ArrayList<>();
    	if(outlet.getAddress() != null){
        	addrErrWarns = addressValidate.addressValidate(outlet.getAddress());
        	errWarns.addAll(addrErrWarns);
        }
        outletErrWarns = outletsValidate.outletValidate(outlet);
        errWarns.addAll(outletErrWarns);
        if(!errWarns.isEmpty())
        	return new ResponseEntity(errWarns, HttpStatus.BAD_REQUEST);
    	Outlet savedOutlet = new Outlet();
		List<Outlet> outletRecords = outletRepository.findAllOutletsByBrandName(brandName);
		if (outletRecords == null)
			return new ResponseEntity<>("Outlets not found", HttpStatus.NOT_FOUND);
		else {
			for (Outlet outletRecord : outletRecords) {
				String tenantName = outlet.getTenantName();
				Long brandId = outlet.getBrandId();

				if (tenantName != null) {
					Tenant tenant = tenantRepository.findByName(tenantName);
					if (tenant == null)
						return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
					outletRecord.setTenant(tenant);
				}
				if (brandId != null) {
					Brand brand = brandRepository.findByBrandId(brandId);
					if (brand == null)
						return new ResponseEntity("Brand Not Found", HttpStatus.NOT_FOUND);
					outletRecord.setBrand(brand);
					outlet.setMerchant(brand.getMerchant());
				}
				if (outlet.getLocationId() != null)
					outletRecord.setLocationId(outlet.getLocationId());
				List<String> uniqOutletQualitiesList = outlet.getUniqOutletQualitiesList();
				if (uniqOutletQualitiesList != null) {
					StringBuilder sb = new StringBuilder();
					for (String uniq : uniqOutletQualitiesList) {
						sb.append(uniq);
						sb.append("|");
					}
					outlet.setUniqOutletQualities(sb.toString());
				}
				if (outlet.getPhone() != null)
					outletRecord.setPhone(outlet.getPhone());
				if (outlet.getUrl() != null)
					outletRecord.setUrl(outlet.getUrl());
				if(outlet.getBrandName() != null)
	            	outletRecord.setBrandName(outlet.getBrandName());
				if (outlet.getAddress() != null) {
					Address address = new Address();
					address.setBuildingName(outlet.getAddress().getBuildingName());
					address.setCityName(outlet.getAddress().getCityName());
					address.setPostalCode(outlet.getAddress().getPostalCode());
					address.setStreetName(outlet.getAddress().getStreetName());
					address.setStreetNo(outlet.getAddress().getStreetNo());
					address.setUnitNo(outlet.getAddress().getUnitNo());
					address.setFloor(outlet.getAddress().getFloor());
					address.setRoadName1(outlet.getAddress().getRoadName1());
					address.setRoadName2(outlet.getAddress().getRoadName2());
					address.setRoadName2(outlet.getAddress().getRoadName2());
					address.setLocality(outlet.getAddress().getLocality());
					address.setCountry(outlet.getAddress().getCountry());
					outletRecord.setAddress(address);
				}
				if (outlet.getOpeningHours() != null) {
					OpeningHours openingHours = new OpeningHours();
					openingHours.setMonday(outlet.getOpeningHours().getMonday());
					openingHours.setTuesday(outlet.getOpeningHours().getTuesday());
					openingHours.setWednesday(outlet.getOpeningHours().getWednesday());
					openingHours.setThursday(outlet.getOpeningHours().getThursday());
					openingHours.setFriday(outlet.getOpeningHours().getFriday());
					openingHours.setSaturday(outlet.getOpeningHours().getSaturday());
					openingHours.setSunday(outlet.getOpeningHours().getSunday());
					outletRecord.setOpeningHours(openingHours);
				}
				savedOutlet = outletRepository.save(outletRecord);
				//return new ResponseEntity<>(savedOutlet.getOutletId(), HttpStatus.OK);
			}
		}
		return new ResponseEntity<>(savedOutlet.getBrandName(), HttpStatus.OK);
	}
    
    @RequestMapping(value = "/api/outlets/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Object> deleteOutlet(@PathVariable(required=true) long id)
    {
        Outlet outletRecord =  outletRepository.findOne(id);
        if(outletRecord != null) {
        	outletRepository.delete(outletRecord);
            return  new ResponseEntity<>("Outlet deleted successfully", HttpStatus.OK);
        }
        else
            return  new ResponseEntity<>("Outlet not found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/outlets", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getAllOutlets(Pageable pageable){
        Page<Outlet> outlets = outletRepository.findAll(pageable);
        if(outlets != null)
            return new ResponseEntity<>(outlets, HttpStatus.OK);
        else
            return new ResponseEntity<>("No outlets found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/outlets/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getOutletsById(@PathVariable(required=true) long id){
        Outlet outlets = outletRepository.findByOutletId(id);
        String uniqOutletQualities = outlets.getUniqOutletQualities(); 
        if(uniqOutletQualities != null){
            String[] uniqOutletQualitiesList = uniqOutletQualities.split("\\s*\\|\\s*");
            outlets.setUniqOutletQualitiesList(Arrays.asList(uniqOutletQualitiesList));
        }
        if(outlets != null)
            return new ResponseEntity<>(outlets, HttpStatus.OK);
        else
            return new ResponseEntity<>("No outlets found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/outlets/search/findAllOutletNames", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<JSONObject> findAllOutletNames(){
        List<Object[]> list = outletRepository.findAllOutletNames();
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/outlets/search/findByName{?name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<JSONObject> findByName(@RequestParam(required=true) String name){
        List<Object[]> list = outletRepository.findByName(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/outlets/search/findByBrandId/", method = RequestMethod.POST)
    @ResponseBody
	public ResponseEntity<JSONObject> findByBrandId(@RequestBody BrandByCityRequest request) {
		long brandId = request.getBrandId();
		List<String> cityCountries = request.getCityCountry();
		//List<Object[]> results = new ArrayList<>();
		Set<Object[]> results = new HashSet<>();
		for (String cityCountry : cityCountries) {
			List<Object[]> result = new ArrayList<>();
			String[] inputs = cityCountry.split(",");
			if (inputs.length == 1) {
				if(inputs[0].equalsIgnoreCase("all"))
					result = outletRepository.findDistinctOutletsByBrandId(brandId);
				else
					result = outletRepository.findByBrandIdAndCountry(brandId, inputs[0]);
				if(result != null) 
					results.addAll(result);
			} else if (inputs.length == 2) {
				result = outletRepository.findByBrandIdAndCity(brandId, inputs[0]);
				if(result != null)
					results.addAll(result);
			}
		}
		if (results != null && results.size() > 0)
			return new ResponseEntity<>(jsonUtils.objectArrayToIdNameSet(results), HttpStatus.OK);
		else
			return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
	}
    
    /*@RequestMapping(value = "/api/outlets/search/findByBrandId", method = RequestMethod.GET)
    @ResponseBody
	public ResponseEntity<JSONObject> findByBrandId(@RequestParam(value="brandId",required=true) long brandId) {
		
    	List<Object[]> outlets = outletRepository.findDistinctOutletsByBrandId(brandId);
		if (outlets != null && outlets.size() > 0)
			return new ResponseEntity<>(jsonUtils.objectArrayToIdName(outlets), HttpStatus.OK);
		else
			return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
	}*/
    
    @RequestMapping(value = "/api/outlets/search/findDistinctByMerchantId/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findDistinctByMerchantId(@PathVariable(required=true) long id){
        List<Object> list = outletRepository.findDistinctByMerchantId(id);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/outlets/search/findDistinctOutlets", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findDistinctOutlets(){
        List<Object> list = outletRepository.findDistinctOutlets();
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/api/outlets/findIfoutletExistsForBrand", method = RequestMethod.GET)
    @ResponseBody
    public boolean ifOutletExistsForBrand(@RequestParam(value="merchantId",required=true) long merchantId , @RequestParam(value="brandName",required=true) String brandName, @RequestParam(value="outletName",required=true) String outletName){
        Outlet outlet = outletRepository.findByBrandIdAndMerchant(merchantId,brandName,outletName);
        if(outlet!=null)
            return true;
        else
            return false;
    }
    
    @RequestMapping(value = "/api/outlets/findIfoutletExistsForBrandName", method = RequestMethod.GET)
    @ResponseBody
    public boolean ifOutletExistsForBrandName(@RequestParam(value="brandName",required=true) String brandName, @RequestParam(value="outletName",required=true) String outletName){
        Outlet outlet = outletRepository.findOutletsByBrandName(brandName,outletName);
        if(outlet!=null)
            return true;
        else
            return false;
    }
    
    @RequestMapping(value = "/api/outlets/summary", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> outletSummary(){
        List<Object[]> objects = outletRepository.outletSummary();
        List<JSONObject> jObjects = new ArrayList<JSONObject>();
        for(Object[] object : objects){
            JSONObject jObject = new JSONObject();
            jObject.put("outletId", object[0]);
            jObject.put("locationId", object[1]);
            jObject.put("city", object[2]);
            jObject.put("offerCount", object[3]);
            jObjects.add(jObject);
        }
        return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/outlets/summaryByMerchant", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> outletSummaryByMerchant(@RequestParam(value="merchantId",required=true) Long id){
        List<Object[]> objects = outletRepository.outletSummaryByMerchant(id);
        List<JSONObject> jObjects = new ArrayList<JSONObject>();
        for(Object[] object : objects){
            JSONObject jObject = new JSONObject();
            jObject.put("merchantId", object[0]);
            jObject.put("brandName", object[1]);
            jObject.put("outletId", object[2]);
            jObject.put("locationId", object[3]);
            jObject.put("city", object[4]);
            jObject.put("offerCount", object[5]);
            jObjects.add(jObject);
        }
        return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/outlets/summary/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> outletSummaryByBrandId(@PathVariable(required=true) Long id){
        List<Object[]> objects = outletRepository.outletSummaryByBrandId(id);
        List<JSONObject> jObjects = new ArrayList<JSONObject>();
        for(Object[] object : objects){
            JSONObject jObject = new JSONObject();
            jObject.put("outletId", object[0]);
            jObject.put("locationId", object[1]);
            jObject.put("city", object[2]);
            jObject.put("offerCount", object[3]);
            jObjects.add(jObject);
        }
        return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/outlets/summaryByBrandName", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> outletSummaryByBrandName(@RequestParam(value="name",required=true) String name){
        List<Object[]> objects = outletRepository.outletSummaryByBrandName(name);
        List<JSONObject> jObjects = new ArrayList<JSONObject>();
        for(Object[] object : objects){
            JSONObject jObject = new JSONObject();
            jObject.put("outletId", object[0]);
            jObject.put("locationId", object[1]);
            jObject.put("city", object[2]);
            jObject.put("offerCount", object[3]);
            jObjects.add(jObject);
        }
        return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/outlets/cityCountry", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getCountryCity(@RequestParam(value="merchantId",required=true) String merchantId, @RequestParam(value="brandName",required=true) String brandName){
        List<Object[]> cityCountry = outletRepository.findCityAndCountry(Long.parseLong(merchantId),brandName);
        List<Object> country = outletRepository.findCountry(Long.parseLong(merchantId),brandName);
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
    
    @RequestMapping(value = "/api/outlets/closeOutlet", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> outletClose(@RequestParam(value="outletId",required=true) long outletId){
    	Outlet outlet = outletRepository.findOne(outletId);
    	if(outlet == null)
    		return new ResponseEntity<>("outlet not found",HttpStatus.OK);
    	Object obj = null;
    	offerRepository.updateOutletStatus("closed",outletId);
    	List<Object> objects = outletRepository.findOfferIdForOutletId(outletId);
    	for(Object object : objects){
    		List<Object> offerId = outletRepository.findOfferIdForOutletIdAndOfferId(Long.parseLong(object.toString()), outletId);
    		if(offerId != null){
    			outletRepository.deleteOutletForOffer(Long.parseLong(object.toString()), outletId);
    		}
    		else{
    			//outletRepository.deleteOutletForOffer(Long.parseLong(object.toString()), outletId);
    			offerRepository.updateOfferStatus("cancelled",Long.parseLong(object.toString()));
    		}
    	}
    	if (outlet.getBrand() != null) {
			Long brandId = outlet.getBrand().getBrandId();
			obj = offerRepository.findIfBrandIsActive(brandId);
			if (obj == null) {
				offerRepository.updateBrandStatus("inactive", brandId);
			}
		}
		if (outlet.getMerchant() != null) {
			Long merchantId = outlet.getMerchant().getMerchantId();
			obj = offerRepository.findIfMerchantIsActive(merchantId);
			if (obj == null) {
				offerRepository.updateMerchantStatus("inactive", merchantId);
			}
		}
    	return new ResponseEntity<>("outlet closed",HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/outlets/closeOutletByBrandName", method = RequestMethod.GET)
    @ResponseBody
	public ResponseEntity<Object> outletCloseByName(
			@RequestParam(value = "outletName", required = true) String outletName,@RequestParam(value = "brandName", required = true) String brandName) {
		List<Outlet> outlets = outletRepository.findByOutletNameAndBrandName(brandName,outletName);
		if(outlets.isEmpty())
			return new ResponseEntity<>("Outlets not found", HttpStatus.OK);
		offerRepository.updateOutletStatusByBrandOutletName("closed",brandName,outletName);
		for (Outlet outlet : outlets) {
			Long outletId = outlet.getOutletId();
			Long brandId = null;
			Long merchantId = null;
			Object obj = null;
			List<Object> objects = outletRepository.findOfferIdForOutletId(outletId);
	    	for(Object object : objects){
	    		Object offerId = outletRepository.findOfferIdForOutletIdAndOfferId(Long.parseLong(object.toString()), outletId);
	    		if(offerId != null)
	    			outletRepository.deleteOutletForOffer(Long.parseLong(object.toString()), outletId);
	    		else{
	    			outletRepository.deleteOutletForOffer(Long.parseLong(object.toString()), outletId);
	    			offerRepository.updateOfferStatus("cancelled",Long.parseLong(object.toString()));
	    		}
	    	}
			if (outlet.getBrand() != null) {
				brandId = outlet.getBrand().getBrandId();
				obj = offerRepository.findIfBrandIsActive(brandId);
				if (obj == null) {
					offerRepository.updateBrandStatus("inactive", brandId);
				}
			}
			if (outlet.getMerchant() != null) {
				merchantId = outlet.getMerchant().getMerchantId();
				obj = offerRepository.findIfMerchantIsActive(merchantId);
				if (obj == null) {
					offerRepository.updateMerchantStatus("inactive", merchantId);
				}
			}
		}
		return new ResponseEntity<>("Outlets closed", HttpStatus.OK);
	}
    
    @PostMapping("/api/outlets/upload")
    @ResponseBody
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile uploadfile) throws IOException {
        BufferedReader fileReader = new BufferedReader(
                new InputStreamReader(uploadfile.getInputStream(), "UTF-8"));
        List<Outlet> outlets = fileReader.lines().skip(1).map(line -> {
            String[] rowSplt = line.split("\t");
            Address address = addressRepository.findByAddressId(addressRepository.findIdByCdfId(rowSplt[1]));
            Brand brand = brandRepository.findByBrandId(brandRepository.findIdByCdfBrandId(rowSplt[2]));
            Merchant merchant = merchantRepository
                    .findByMerchantId(merchantRepository.findIdByCdfMerchantId(rowSplt[3]));
            OpeningHours openingHours = openingHoursRepository
                    .findByOpeningHoursId(openingHoursRepository.findIdByCdfOpeningHoursId(rowSplt[4]));
            Tenant tenant = tenantRepository.findByName(rowSplt[5]);
            return new Outlet(rowSplt[0], address, brand, merchant, openingHours, tenant, rowSplt[5]);
        }).collect(Collectors.toList());
        outlets.forEach(outlet -> outletRepository.save(outlet));
        fileReader.close();
        return new ResponseEntity<>("Outlet file successfully uploaded", HttpStatus.OK);
    }
    
}