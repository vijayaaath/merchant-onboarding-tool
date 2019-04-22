package com.crayondata.merchantonboarding.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.crayondata.merchantonboarding.model.Address;
import com.crayondata.merchantonboarding.model.Brand;
import com.crayondata.merchantonboarding.model.ErrorWarning;
import com.crayondata.merchantonboarding.model.Merchant;
import com.crayondata.merchantonboarding.model.Tenant;
import com.crayondata.merchantonboarding.model.User;
import com.crayondata.merchantonboarding.repository.AddressRepository;
import com.crayondata.merchantonboarding.repository.MerchantRepository;
import com.crayondata.merchantonboarding.repository.OfferRepository;
import com.crayondata.merchantonboarding.repository.TenantRepository;
import com.crayondata.merchantonboarding.repository.UserRepository;
import com.crayondata.merchantonboarding.service.AddressValidate;
import com.crayondata.merchantonboarding.service.MerchantsValidate;
import com.crayondata.merchantonboarding.utils.JsonUtils;
import com.crayondata.merchantonboarding.validator.MandatoryValidator;

@Controller
public class MerchantController {

    @Autowired
    private TenantRepository tenantRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private MerchantRepository merchantRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JsonUtils jsonUtils;
    
    @RequestMapping(value = "/api/merchants", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addMerchant(
            @RequestBody(required=true) Merchant merchant) throws Exception
    {   
    	MerchantsValidate merchantsValidate = new MerchantsValidate();
    	AddressValidate addressValidate = new AddressValidate();
    	List<ErrorWarning> merchantErrors = new ArrayList<>();
    	List<ErrorWarning> addressErrors = new ArrayList<>();
    	List<ErrorWarning> errWarns = new ArrayList<>();
        String tenantName = merchant.getTenantName();
        Tenant tenant = tenantRepository.findByName(tenantName);
        if(tenant == null)
            return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
        merchant.setTenant(tenant);
        merchant.setStatus("inactive");
        if(merchant.getAddress() != null){
        	addressErrors = addressValidate.addressValidate(merchant.getAddress());
        	errWarns.addAll(addressErrors);
        }
        merchantErrors = merchantsValidate.merchantValidate(merchant);
        errWarns.addAll(merchantErrors);
        if(!errWarns.isEmpty())
        	return new ResponseEntity<>(errWarns, HttpStatus.BAD_REQUEST);
        Merchant savedRecord = merchantRepository.save(merchant);
        return new ResponseEntity<>(savedRecord.getMerchantId(), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/merchants/{id}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateMerchant(@PathVariable(required=true) long id, @RequestBody(required=true) Merchant merchant) throws Exception
    {
    	MerchantsValidate merchantsValidate = new MerchantsValidate();
    	AddressValidate addressValidate = new AddressValidate();
    	List<ErrorWarning> merchantErrors = new ArrayList<>();
    	List<ErrorWarning> addressErrors = new ArrayList<>();
    	List<ErrorWarning> errWarns = new ArrayList<>();
        Merchant merchantRecord =  merchantRepository.findOne(id);
        if(merchantRecord == null)
            return  new ResponseEntity<>("Merchant not found", HttpStatus.NOT_FOUND);
        else {
        	if(merchant.getTenantName() != null){
        		String tenantName = merchant.getTenantName();
        		Tenant tenant = tenantRepository.findByName(tenantName);
        		if(tenant == null)
                     return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
        		merchantRecord.setTenant(tenant);
        	}
        	if(merchant.getAddress() != null){
            	addressErrors = addressValidate.addressValidate(merchant.getAddress());
            	errWarns.addAll(addressErrors);
            }
            merchantErrors = merchantsValidate.merchantValidate(merchant);
            errWarns.addAll(merchantErrors);
            if(!errWarns.isEmpty())
            	return new ResponseEntity<>(errWarns, HttpStatus.BAD_REQUEST);
            if(merchant.getName() != null)
            	merchantRecord.setName(merchant.getName());
            if(merchant.getName() != null)
            	merchantRecord.setBusinessType(merchant.getBusinessType());
            if(merchant.getBusinessType() != null)
            	merchantRecord.setDescription(merchant.getDescription());
            if(merchant.getCommercialModel() != null)
            	merchantRecord.setCommercialModel(merchant.getCommercialModel());
            if(merchant.getContactPerson() != null)
            	merchantRecord.setContactPerson(merchant.getContactPerson());
            if(merchant.getPhoneNumber() != null)
            	merchantRecord.setPhoneNumber(merchant.getPhoneNumber());
            if(merchant.getEmail() != null)
            	merchantRecord.setEmail(merchant.getEmail());
            if(merchant.getBusinessTitle() != null)
            	merchantRecord.setBusinessTitle(merchant.getBusinessTitle());
            if(merchant.getCdfMerchantId() != null)
            	merchantRecord.setCdfMerchantId(merchant.getCdfMerchantId());
            if(merchant.getAddress() != null){
            	Address address = new Address();
            	address.setBuildingName(merchant.getAddress().getBuildingName());
            	address.setCityName(merchant.getAddress().getCityName());
            	address.setPostalCode(merchant.getAddress().getPostalCode());
            	address.setStreetName(merchant.getAddress().getStreetName());
            	address.setStreetNo(merchant.getAddress().getStreetNo());
            	address.setUnitNo(merchant.getAddress().getUnitNo());
            	address.setFloor(merchant.getAddress().getFloor());
            	address.setRoadName1(merchant.getAddress().getRoadName1());
            	address.setRoadName2(merchant.getAddress().getRoadName2());
            	address.setRoadName2(merchant.getAddress().getRoadName2());
            	address.setLocality(merchant.getAddress().getLocality());
            	address.setCountry(merchant.getAddress().getCountry());
            	merchantRecord.setAddress(address);
            }
            Merchant savedRecord = merchantRepository.save(merchantRecord);
            return new ResponseEntity<>(savedRecord.getMerchantId(), HttpStatus.OK);
        }
    }
    
    @RequestMapping(value = "/api/merchants/name/{name}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateMerchantByName(@PathVariable(required=true) String name, @RequestBody(required=true) Merchant merchant)
	{
    	Merchant savedRecord = new Merchant();
		List<Merchant> merchantRecords = merchantRepository.findMerchantByName(name);
		if (merchantRecords == null)
			return new ResponseEntity<>("Merchant not found", HttpStatus.NOT_FOUND);
		else {
			for (Merchant merchantRecord : merchantRecords) {
				if (merchant.getTenantName() != null) {
					String tenantName = merchant.getTenantName();
					Tenant tenant = tenantRepository.findByName(tenantName);
					if (tenant == null)
						return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
					merchantRecord.setTenant(tenant);
				}
				if (merchant.getName() != null)
					merchantRecord.setName(merchant.getName());
				if (merchant.getName() != null)
					merchantRecord.setBusinessType(merchant.getBusinessType());
				if (merchant.getBusinessType() != null)
					merchantRecord.setDescription(merchant.getDescription());
				if (merchant.getCommercialModel() != null)
					merchantRecord.setCommercialModel(merchant.getCommercialModel());
				if (merchant.getContactPerson() != null)
					merchantRecord.setContactPerson(merchant.getContactPerson());
				if (merchant.getPhoneNumber() != null)
					merchantRecord.setPhoneNumber(merchant.getPhoneNumber());
				if (merchant.getEmail() != null)
					merchantRecord.setEmail(merchant.getEmail());
				if (merchant.getBusinessTitle() != null)
					merchantRecord.setBusinessTitle(merchant.getBusinessTitle());
				if(merchant.getCdfMerchantId() != null)
	            	merchantRecord.setCdfMerchantId(merchant.getCdfMerchantId());
				if (merchant.getAddress() != null) {
					Address address = new Address();
					address.setBuildingName(merchant.getAddress().getBuildingName());
					address.setCityName(merchant.getAddress().getCityName());
					address.setPostalCode(merchant.getAddress().getPostalCode());
					address.setStreetName(merchant.getAddress().getStreetName());
					address.setStreetNo(merchant.getAddress().getStreetNo());
					address.setUnitNo(merchant.getAddress().getUnitNo());
					address.setFloor(merchant.getAddress().getFloor());
					address.setRoadName1(merchant.getAddress().getRoadName1());
					address.setRoadName2(merchant.getAddress().getRoadName2());
					address.setRoadName2(merchant.getAddress().getRoadName2());
					address.setLocality(merchant.getAddress().getLocality());
					address.setCountry(merchant.getAddress().getCountry());
					merchantRecord.setAddress(address);
				}
				savedRecord = merchantRepository.save(merchantRecord);
			}
			return new ResponseEntity<>(savedRecord.getName(), HttpStatus.OK);
		}
	}
    
    @RequestMapping(value = "/api/merchants/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Object> deleteMerchant(@PathVariable(required=true) long id)
    {
        Merchant merchantRecord =  merchantRepository.findOne(id);
        if(merchantRecord != null) {
        	merchantRepository.delete(merchantRecord);
            return  new ResponseEntity<>("Merchant deleted successfully", HttpStatus.OK);
        }
        else
            return  new ResponseEntity<>("Merchant not found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/merchants", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getAllMerchants(Pageable pageable){
        Page<Merchant> merchants = merchantRepository.findAll(pageable);
        if(merchants != null)
            return new ResponseEntity<>(merchants, HttpStatus.OK);
        else
            return new ResponseEntity<>("No merchants found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/merchants/distinct", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getDistinctMerchants(){
    	List<Map<String,String>> merchantIdNameList = new ArrayList();
        List<Object[]> merchants = merchantRepository.findDistinctMerchant();
		if (merchants != null) {
			for (Object[] merchant : merchants) {
				Map<String,String> merchantIdName = new HashMap<>();
				merchantIdName.put("merchant_id",merchant[0].toString());
				merchantIdName.put("name",  merchant[1].toString());
				merchantIdNameList.add(merchantIdName);
			}
		}
        if(merchants != null)
            return new ResponseEntity<>(merchantIdNameList, HttpStatus.OK);
        else
            return new ResponseEntity<>("No merchants found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/merchants/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getMerchantsById(@PathVariable(required=true) long id){
        Merchant merchants = merchantRepository.findByMerchantId(id);
        if(merchants != null)
            return new ResponseEntity<>(merchants, HttpStatus.OK);
        else
            return new ResponseEntity<>("No merchants found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/merchants/search/findAllMerchantNames", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<JSONObject> findAllmerchantNames(){
        List<Object[]> list = merchantRepository.findAllMerchantNames();
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);   
    }
    
    @RequestMapping(value = "/api/merchants/search/findByName{?name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findByName(@RequestParam(required=true) String name){
        List<Object[]> list = merchantRepository.findByName(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/merchants/search/findByBrandName{?name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findByBrandName(@RequestParam(required=true) String name){
        List<Merchant> list = merchantRepository.findByBrandName(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(list, HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/merchants/search/findByBrandId/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findByBrandId(@PathVariable(required=true) Long id){
        Merchant result = merchantRepository.findByBrandId(id);
        if(result != null)
            return new ResponseEntity<>(result, HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    
    /*@RequestMapping(value = "/api/merchants/countryMap", method = RequestMethod.GET)
    @ResponseBody
    public Map<Object,List<Object>> getCountryCity(){
        Map<Object,List<Object>> cityCountryMap = new HashMap<Object,List<Object>>();
        List<Object[]> objects = merchantRepository.findCityAndCountry();
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
    }*/

    @RequestMapping(value = "/api/merchants/cityCountry", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getCountryCity(){
        List<Object[]> cityCountry = merchantRepository.findCityAndCountry();
        List<Object> country = merchantRepository.findCountry();
        List<String> val= new ArrayList<>();
        for(Object[] object : cityCountry){
        	//if((object[0] != null && object[1] != null) && (object[0] != "" && object[1] != ""))
        	//if(!object[1].toString().equalsIgnoreCase("singapore"))
        	if(object[0] != null && !object[0].toString().isEmpty())
        		val.add(object[0].toString()+","+object[1].toString());
        }
        for(Object object : country){
        	if(object != null )
        		val.add(object.toString());
        }
        return val;
    }
    
    @RequestMapping(value = "/api/merchants/cityCountryByUser", method = RequestMethod.GET)
    @ResponseBody
    public List<String> getCountryCityByUser(@RequestParam(required=true) Long userId){
    	List<Object[]>	cityCountry = new ArrayList<>();
    	List<Object> country = new ArrayList<>();
    	if(userRepository.findUserRoles(userId).contains("ADMIN")){
    		cityCountry = merchantRepository.findCityAndCountry();
        	country = merchantRepository.findCountry();
    	} else{
    		cityCountry = merchantRepository.findCityAndCountry(userId);
    		country = merchantRepository.findCountry(userId);
    	}
        List<String> val= new ArrayList<>();
        for(Object[] object : cityCountry){
        	if(object[0] != null && !object[0].toString().isEmpty())
        		val.add(object[0].toString()+","+object[1].toString());
        }
        for(Object object : country){
        	if(object != null )
        		val.add(object.toString());
        }
        return val;
    }
    
    @RequestMapping(value = "/api/merchants/search/findMerchant/{name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findMerchant(@PathVariable(required=true) String name){
       List<Object[]> list = new ArrayList<>();
       String[] inputs = name.split(",");
       if(inputs.length == 1){
    	   list = merchantRepository.findMerchantByCountry(inputs[0]);
       } else if(inputs.length == 2){
    	   list = merchantRepository.findMerchantByCity(inputs[0]);
       }
       if(list != null && list.size() > 0)
           return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
       else
           return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/merchants/search/findMerchantByUser/{name}", method = RequestMethod.GET)
    @ResponseBody
	public ResponseEntity<Object> findMerchant(@PathVariable(required = true) String name,
			@RequestParam(required = true) Long userId) {
		List<Object[]> list = new ArrayList<>();
		String[] inputs = name.split(",");

		if (userRepository.findUserRoles(userId).contains("ADMIN")) {
			if (inputs.length == 1) {
				list = merchantRepository.findMerchantByCountry(inputs[0]);
			} else if (inputs.length == 2) {
				list = merchantRepository.findMerchantByCity(inputs[0]);
			}
		} else {
			if (inputs.length == 1) {
				list = merchantRepository.findMerchantByCountry(inputs[0],userId);
			} else if (inputs.length == 2) {
				list = merchantRepository.findMerchantByCity(inputs[0],userId);
			}
		}

		/*if (inputs.length == 1) {
			list = merchantRepository.findMerchantByCountry(inputs[0]);
		} else if (inputs.length == 2) {
			list = merchantRepository.findMerchantByCity(inputs[0]);
		}*/
		if (list != null && list.size() > 0)
			return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
		else
			return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
	}
    
    @RequestMapping(value = "/api/merchants/search/findMerchantByCountry{?name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findMerchantByCountry(@RequestParam(required=true) String name){
        List<Object[]> list = merchantRepository.findMerchantByCountry(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/merchants/search/findMerchantByCity{?name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> findMerchantByCity(@RequestParam(required=true) String name){
        List<Object[]> list = merchantRepository.findMerchantByCity(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/merchants/search/country", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,List<String>> findExistingCountry(){
        Map<String,List<String>> countryMap = new HashMap<String,List<String>>();
        List<String> countries = merchantRepository.findExistingCountry();
        countryMap.put("country", countries);    
        return countryMap;
    }
    
    @RequestMapping(value = "/api/merchants/search/city{?name}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,List<String>> findExistingCity(@RequestParam(required=true) String name){
        Map<String,List<String>> cityMap = new HashMap<String,List<String>>();
        List<String> cities = merchantRepository.findExistingCity(name);
        cityMap.put("city", cities);    
        return cityMap;
    }
    
    @RequestMapping(value = "/api/merchants/search/country/all", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,List<String>> findAllCountry(){
        Map<String,List<String>> countryMap = new HashMap<String,List<String>>();
        List<String> countries = merchantRepository.findAllCountry();
        countryMap.put("country", countries);    
        return countryMap;
    }
    
    @RequestMapping(value = "/api/merchants/search/city/all{?name}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,List<String>> findAllCity(@RequestParam(required=true) String name){
        Map<String,List<String>> cityMap = new HashMap<String,List<String>>();
        List<String> cities = merchantRepository.findAllCity(name);
        cityMap.put("city", cities);    
        return cityMap;
    }
    
    @RequestMapping(value = "/api/merchants/closeMerchant", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> merchantClose(@RequestParam(value="merchantId",required=true) long merchantId){
    	Merchant merchant = merchantRepository.findOne(merchantId);
    	if(merchant == null)
			return new ResponseEntity<>("Merchant not found", HttpStatus.OK);
    	offerRepository.updateMerchantStatus("closed", merchantId);
    	merchantRepository.updateBrandStatusForMerchant("closed", merchantId);
    	merchantRepository.updateOutletStatusForMerchant("closed", merchantId);
    	merchantRepository.updateOfferStatusForMerchant("cancelled", merchantId);
    	return new ResponseEntity<>("Merchant closed",HttpStatus.OK);
    }
    
    
    
    @PostMapping("/api/merchants/upload")
    @ResponseBody
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile uploadfile) throws IOException {
        BufferedReader fileReader = new BufferedReader(
                new InputStreamReader(uploadfile.getInputStream(), "UTF-8"));

        List<Merchant> merchants = fileReader.lines().skip(1).map(line -> {
            String[] rowSplt = line.split("\t");
            Tenant tenant = tenantRepository.findByName(rowSplt[2]);
            Address address = addressRepository.findByAddressId(addressRepository.findIdByCdfId(rowSplt[1]));
            return new Merchant(rowSplt[0], address, tenant, rowSplt[3]);
        }).collect(Collectors.toList());
        merchants.forEach(merchant -> merchantRepository.save(merchant));
        fileReader.close();
        return new ResponseEntity<>("Merchant file successfully uploaded", HttpStatus.OK);
    }
    
}