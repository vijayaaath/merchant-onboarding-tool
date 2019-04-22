package com.crayondata.merchantonboarding.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.crayondata.merchantonboarding.enums.OfferStatus;
import com.crayondata.merchantonboarding.model.Address;
import com.crayondata.merchantonboarding.model.Brand;
import com.crayondata.merchantonboarding.model.ErrorWarning;
import com.crayondata.merchantonboarding.model.ImageResponse;
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
import com.crayondata.merchantonboarding.repository.OutletRepository;
import com.crayondata.merchantonboarding.repository.TenantRepository;
import com.crayondata.merchantonboarding.repository.UserRepository;
import com.crayondata.merchantonboarding.service.BrandService;
import com.crayondata.merchantonboarding.service.OffersValidate;
import com.crayondata.merchantonboarding.utils.JsonUtils;

@Controller
public class OfferController {
	@Autowired
    private TenantRepository tenantRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private MerchantRepository merchantRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private OutletRepository outletRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BrandService brandService;
    @Autowired
    private JsonUtils jsonUtils;
        
    @Value("${aws.offer.file.path:null}")
	public String awsOfferPath;
    
    @Value("${aws.domain.name:null}")
	public String awsDomainName;
    
    @RequestMapping(value = "/api/offers", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addOffers(@ModelAttribute Offer offer) throws Exception
    {
    	List<ErrorWarning> offerErrors = new ArrayList<ErrorWarning>();
    	OffersValidate offersValidate = new OffersValidate();
    	Set<Images> imageList = new HashSet<>();
        String tenantName = offer.getTenantName();
        Timestamp fromTime = null;
        Timestamp toTime = null;
        boolean status = false;
        DateFormat converter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        converter.setTimeZone(TimeZone.getTimeZone("GMT"));
        
        Tenant tenant = tenantRepository.findByName(tenantName);
        if(tenant == null)
            return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
        
        offerErrors = offersValidate.offerValidate(offer);        
        if(!offerErrors.isEmpty())
        	return new ResponseEntity(offerErrors, HttpStatus.BAD_REQUEST);
        
        Set<Outlet> outlets = offer.getOfferRedeemOutlets();
        if(offer.getValidFrom() != null){
        	fromTime = Timestamp.valueOf(offer.getValidFrom());
        	Date parsedDate = dateFormat.parse(converter.format(fromTime));
        	fromTime = new Timestamp(parsedDate.getTime());
        	offer.setValid_from(fromTime);
        }
        if(offer.getValidTo() != null){
        	toTime = Timestamp.valueOf(offer.getValidTo());
        	Date parsedDate = dateFormat.parse(converter.format(toTime));
        	toTime = new Timestamp(parsedDate.getTime());
        	offer.setValid_to(toTime);
        }
        if(offer.getValidFrom() != null && offer.getValidTo() != null){
        	Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        	if(timestamp.after(fromTime) && timestamp.before(toTime)){
        		//offer.setStatus(OfferStatus.LIVE.name());
        		offer.setStatus("active");
        		status = true;
        	} else if(timestamp.before(fromTime)){
        		status = true;
        		//offer.setStatus(OfferStatus.SCHEDULED.name());
        		offer.setStatus("pending");
        	} else{
        		offer.setStatus("expired");
        	}
        }
        if(offer.getBrandImageOverride()!= null){
        	try {
        		Long id = Long.parseLong(offerRepository.findLastId().toString());
        		imageList = brandService.uploadImages(offer.getBrandImageOverride(),"offer" , id+1);
			} catch (Exception e) {
				e.printStackTrace();
			}
        }
        if(imageList != null)
        	offer.setImages(imageList);
        offer.setTenant(tenant);
        Brand brand = null;
        Merchant merchant = null;
		for (Outlet outlet : outlets) {
			brand = outlet.getBrand();
			merchant = outlet.getMerchant();
			if (status) {
				outlet.setStatus("active");
				brand.setStatus("active");
				merchant.setStatus("active");
			}
		}
        offer.setBrand(brand);
        offer.setMerchant(merchant);
        Offer savedOffer = offerRepository.save(offer);
        return new ResponseEntity<>(savedOffer.getOfferId(), HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/offers/{id}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateOffers(@PathVariable(required=true) long id, @ModelAttribute Offer offer) throws Exception
    {	
    	List<ErrorWarning> offerErrors = new ArrayList<ErrorWarning>();
    	OffersValidate offersValidate = new OffersValidate();
    	Timestamp fromTime = null;
        Timestamp toTime = null;
        boolean status = false;
    	Set<Images> imageList = new HashSet<>();
        Offer offerRecord =  offerRepository.findOne(id);
        if(offerRecord == null)
            return  new ResponseEntity<>("Offer not found", HttpStatus.NOT_FOUND);
        else {
            String tenantName = offer.getTenantName();

            if(tenantName != null){
            	Tenant tenant = tenantRepository.findByName(tenantName);
            	if(tenant == null)
                    return new ResponseEntity("Tenant Not Found", HttpStatus.NOT_FOUND);
            	offerRecord.setTenant(tenant);
            }
            offerErrors = offersValidate.offerValidate(offer);        
            if(!offerErrors.isEmpty())
            	return new ResponseEntity(offerErrors, HttpStatus.BAD_REQUEST);
            if(offer.getBrandImageOverride()!= null){
            	try {
            		imageList = brandService.uploadImages(offer.getBrandImageOverride(),"offer" , id);
            		if(imageList != null)
            			offerRecord.setImages(imageList);
    			} catch (Exception e) {
    				e.printStackTrace();
    			}
            }
            if(offer.getValidFrom() != null){
            	fromTime = Timestamp.valueOf(offer.getValidFrom());
            	offerRecord.setValid_from(fromTime);
            }
            if(offer.getValidTo() != null){
            	toTime = Timestamp.valueOf(offer.getValidTo());
            	offerRecord.setValid_to(toTime);
            }
            if(offerRecord.getValid_from() != null && offerRecord.getValid_to() != null){
            	Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            	fromTime = Timestamp.valueOf(offerRecord.getValid_from());
            	toTime = Timestamp.valueOf(offerRecord.getValid_to());
            	if(timestamp.after(fromTime) && timestamp.before(toTime)){
            		//offerRecord.setStatus(OfferStatus.LIVE.name());
            		offerRecord.setStatus("active");
            		status = true;
            	} else if(timestamp.before(fromTime)){
            		status = true;
            		//offerRecord.setStatus(OfferStatus.SCHEDULED.name());
            		offerRecord.setStatus("pending");
            	} else{
            		offerRecord.setStatus("expired");
            	}
            } 
            if(offer.getOfferRedeemOutlets() != null){
            	Set<Outlet> outlets = offer.getOfferRedeemOutlets();
                //Outlet outlet = outlets.iterator().next();
                Brand brand = null;
                Merchant merchant = null;
        		for (Outlet outlet : outlets) {
        			brand = outlet.getBrand();
        			merchant = outlet.getMerchant();
        			if (status) {
        				outlet.setStatus("active");
        				brand.setStatus("active");
        				merchant.setStatus("active");
        			}
        		}
                offerRecord.setBrand(brand);
                offerRecord.setMerchant(merchant);
                offerRecord.setOfferRedeemOutlets(offer.getOfferRedeemOutlets());
            }
            if(offer.getShortDesc() != null)
            	offerRecord.setShortDesc(offer.getShortDesc());
            if(offer.getMedDesc() != null)
            	offerRecord.setMedDesc(offer.getMedDesc());
            if(offer.getLongDesc() != null)
            	offerRecord.setLongDesc(offer.getLongDesc());
            if(offer.getValidFrom() != null)
            	offerRecord.setValidFrom(offer.getValidFrom());
            if(offer.getValidTo() != null)
            	offerRecord.setValidTo(offer.getValidTo());
            if(offer.getPostalCode() != null)
            	offerRecord.setPostalCode(offer.getPostalCode());
            if(offer.getPromoCode() != null)
            	offerRecord.setPromoCode(offer.getPromoCode());
            if(offer.getRedeemUrl() != null)
            	offerRecord.setRedeemUrl(offer.getRedeemUrl());
            if(offer.getEligibilityAndRemarks() != null)
            	offerRecord.setEligibilityAndRemarks(offer.getEligibilityAndRemarks());
            if(offer.getBrandImageOverride() != null)
            	offerRecord.setBrandImageOverride(offer.getBrandImageOverride());
            if(offer.getCdfOfferId() != null)
            	offerRecord.setCdfOfferId(offer.getCdfOfferId());
            Offer savedOffer = offerRepository.save(offerRecord);
            return new ResponseEntity<>(savedOffer.getOfferId(), HttpStatus.OK);
        }
    }
    
    @RequestMapping(value = "/api/offers/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<Object> deleteOffer(@PathVariable(required=true) long id)
    {
        Offer offerRecord =  offerRepository.findOne(id);
        if(offerRecord != null) {
        	offerRepository.delete(offerRecord);
            return  new ResponseEntity<>("Offer deleted successfully", HttpStatus.OK);
        }
        else
            return  new ResponseEntity<>("Offer not found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/offers", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getAllOffers(@RequestParam(required=false,defaultValue="all") String status,@RequestBody(required = false) JSONObject jObject){
        List<Offer> offers = new ArrayList<>();
        Timestamp timeStamp = null;
		Calendar cal = Calendar.getInstance();
        if (jObject == null) {
			timeStamp = new Timestamp(System.currentTimeMillis());
			cal.setTime(timeStamp);
			cal.add(Calendar.MONTH, 1);
			timeStamp = new Timestamp(cal.getTimeInMillis());
			System.out.println("Time : " + timeStamp);
		} else {
			timeStamp = Timestamp.valueOf(jObject.get("time").toString());
		}
        if(status.equals("all"))
        	offers = offerRepository.findAll();
        else if(status.equalsIgnoreCase("active"))
        	offers = offerRepository.findActiveOfferEntities();
        else if(status.equalsIgnoreCase("pending"))
        	offers = offerRepository.findPendingOffers(timeStamp);
        else if(status.equalsIgnoreCase("expired"))
        	offers = offerRepository.findExpiringOffers(timeStamp);
        if(offers != null)
            return new ResponseEntity<>(offers, HttpStatus.OK);
        else
            return new ResponseEntity<>("No offers found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/offersByUser", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getAllOffersByUser(@RequestParam(required=true) Long userId, @RequestParam(required=false,defaultValue="all") String status, Pageable pageable){
    	Page<Offer> offers = null;
 		Calendar cal = Calendar.getInstance();
 		Timestamp timeStamp = new Timestamp(System.currentTimeMillis());
		
		if (status.equals("all")) {
			if (userRepository.findUserRoles(userId).contains("ADMIN")) {
				offers = offerRepository.findAll(pageable);
			} else {
				offers = offerRepository.findByUserPaged(userId,pageable);
			}
		} else if(status.equalsIgnoreCase("active")){
			if (userRepository.findUserRoles(userId).contains("ADMIN")) {
	        	offers = offerRepository.findActiveOfferEntitiesPaged(pageable);
			} else{
				offers = offerRepository.findActiveOfferByUserPaged(userId,pageable);
			}
		} else if(status.equalsIgnoreCase("pending")){
			if (userRepository.findUserRoles(userId).contains("ADMIN")) {
	        	offers = offerRepository.findPendingOffersPaged(timeStamp, pageable);
			} else{
				offers = offerRepository.findPendingOfferByUserPaged(userId,timeStamp, pageable);
			}
		} else if(status.equalsIgnoreCase("expired")){
			cal.setTime(timeStamp);
			cal.add(Calendar.MONTH, 1);
			timeStamp = new Timestamp(cal.getTimeInMillis());
			if (userRepository.findUserRoles(userId).contains("ADMIN")) {
	        	offers = offerRepository.findExpiringOffersPaged(timeStamp, pageable);
			} else{
				offers = offerRepository.findExpiringOfferByUserPaged(userId,timeStamp,pageable);
			}
		}
        if(offers != null)
            return new ResponseEntity<>(offers, HttpStatus.OK);
        else
            return new ResponseEntity<>("No offers found", HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/offers/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> getOffersById(@PathVariable(required=true) long id){
        Offer offers = offerRepository.findByOfferId(id);
        if(offers == null)
        	return new ResponseEntity<>("No offers found", HttpStatus.NOT_FOUND);
        Set<Images> images = offers.getImages();
        Set<ImageResponse> returnImages = new HashSet<>();
        String imageUrl = null;
        
        for(Images image : images){
        	ImageResponse imgResponse = new ImageResponse();
        	String imageName = image.getImage();
			if (imageName != null && !imageName.isEmpty()) {
				imageUrl = awsDomainName + awsOfferPath + imageName;
				imgResponse.setId(image.getId());
				imgResponse.setImage(imageUrl);
				// image.setImage(imageUrl);
				returnImages.add(imgResponse);
			}
        }
        offers.setImageResponse(returnImages);
        return new ResponseEntity<>(offers, HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/offers/search/findAllOfferNames", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<JSONObject> findAllOfferNames(){
        List<Object[]> list = offerRepository.findAllOfferNames();
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    
    @RequestMapping(value = "/api/offers/search/findByName{?name}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<JSONObject> findByName(@RequestParam(required=true) String name){
        List<Object[]> list = offerRepository.findByName(name);
        if(list != null && list.size() > 0)
            return new ResponseEntity<>(jsonUtils.objectArrayToIdName(list), HttpStatus.OK);
        else
            return new ResponseEntity<>(new JSONObject(), HttpStatus.NOT_FOUND);
    }
    @RequestMapping(value = "/api/offers/summary", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> offerSummary(){
    	List<Object[]> objects = offerRepository.offerSummary();
    	List<JSONObject> jObjects = new ArrayList<JSONObject>();
    	for(Object[] object : objects){
    		JSONObject jObject = new JSONObject();
    		jObject.put("merchantId", object[0]);
    		jObject.put("brandId", object[1]);
    		jObject.put("tenantName", object[2]);
    		jObject.put("brandName", object[3]);
    		jObject.put("category", object[4]);
    		jObject.put("outletId", object[5]);
    		jObject.put("outletName", object[6]);
    		jObject.put("offerId", object[7]);
    		jObject.put("offerName", object[8]);
    		jObject.put("status", object[9]);
    		jObject.put("outlets", object[10]);
    		try{
    			jObject.put("validFrom", new SimpleDateFormat("yyyy-MM-dd").format(object[11]));
    		} catch(Exception e){
    			jObject.put("validFrom",null);
    		}
    		try{
    			jObject.put("validTo", new SimpleDateFormat("yyyy-MM-dd").format(object[12]));
    		} catch(Exception e){
    			jObject.put("validTo",null);
    		}
    		jObjects.add(jObject);
    	}
    	return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/offers/summaryByMerchant", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> offerSummaryByMerchant(@RequestParam(value="merchantId",required=true) long id){
    	List<Object[]> objects = offerRepository.offerSummaryByMerchant(id);
    	List<JSONObject> jObjects = new ArrayList<JSONObject>();
    	for(Object[] object : objects){
    		JSONObject jObject = new JSONObject();
    		jObject.put("merchantId", object[0]);
    		jObject.put("brandId", object[1]);
    		jObject.put("brandName", object[2]);
    		jObject.put("outletId", object[3]);
    		jObject.put("outletName", object[4]);
    		jObject.put("offerId", object[5]);
    		jObject.put("offerName", object[6]);
    		jObject.put("status", object[7]);
    		jObject.put("outlets", object[8]);
    		jObject.put("validFrom", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(object[9]));
    		jObject.put("validTo", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(object[10]));
    		jObjects.add(jObject);
    	}
    	return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    @RequestMapping(value = "/api/offers/summary/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> offerSummary(@PathVariable(required=true) long id){
    	List<Object[]> objects = offerRepository.offerSummary(id);
    	List<JSONObject> jObjects = new ArrayList<JSONObject>();
    	for(Object[] object : objects){
    		JSONObject jObject = new JSONObject();
    		jObject.put("merchantId", object[0]);
    		jObject.put("brandId", object[1]);
    		jObject.put("brandName", object[2]);
    		jObject.put("outletId", object[3]);
    		jObject.put("outletName", object[4]);
    		jObject.put("offerId", object[5]);
    		jObject.put("offerName", object[6]);
    		jObject.put("status", object[7]);
    		jObject.put("outlets", object[8]);
    		jObject.put("validFrom", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(object[9]));
    		jObject.put("validTo", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(object[10]));
    		jObjects.add(jObject);
    	}
    	return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/offers/summaryByBrandName", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<JSONObject>> offerSummary(@RequestParam(value="name",required=true) String name){
    	List<Object[]> objects = offerRepository.offerSummaryByBrandName(name);
    	List<JSONObject> jObjects = new ArrayList<JSONObject>();
    	for(Object[] object : objects){
    		JSONObject jObject = new JSONObject();
    		jObject.put("merchantId", object[0]);
    		jObject.put("brandId", object[1]);
    		jObject.put("brandName", object[2]);
    		jObject.put("outletId", object[3]);
    		jObject.put("outletName", object[4]);
    		jObject.put("offerId", object[5]);
    		jObject.put("offerName", object[6]);
    		jObject.put("status", object[7]);
    		jObject.put("outlets", object[8]);
    		jObject.put("validFrom", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(object[9]));
    		jObject.put("validTo", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(object[10]));
    		jObjects.add(jObject);
    	}
    	return new ResponseEntity<>(jObjects,HttpStatus.OK);
    }
    
    @RequestMapping(value = "/api/offers/cancelOffer", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Object> offerCancel(@RequestParam(value="offerId",required=true) long offerId){
    	Offer offer = offerRepository.findOne(offerId);
    	if(offer == null)
			return new ResponseEntity<>("Offer not found", HttpStatus.OK);
    	long brandId = offer.getBrand().getBrandId();
    	long merchantId = offer.getMerchant().getMerchantId();
    	offerRepository.updateOfferStatus("cancelled",offer.getOfferId());
    	Set<Outlet> outlets = offer.getOfferRedeemOutlets();
    	Object obj = null;
    	for(Outlet outlet : outlets){
    		obj = offerRepository.findIfOutletIsActive(outlet.getOutletId());
    		if(obj == null){
    			offerRepository.updateOutletStatus("inactive",outlet.getOutletId());
    		}
    	}
    	obj = offerRepository.findIfBrandIsActive(brandId);
    	if(obj == null){
			offerRepository.updateBrandStatus("inactive",brandId);
		}
    	obj = offerRepository.findIfMerchantIsActive(merchantId);
    	if(obj == null){
			offerRepository.updateMerchantStatus("inactive",merchantId);
		}
    	offer.setStatus(OfferStatus.CANCELLED.name());
    	return new ResponseEntity<>("Offer cancelled",HttpStatus.OK);
    }
    
    @PostMapping("/api/offers/upload")
    @ResponseBody
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile uploadfile) throws IOException {
        BufferedReader fileReader = new BufferedReader(
                new InputStreamReader(uploadfile.getInputStream(), "UTF-8"));
        List<Offer> offers = fileReader.lines().skip(1).map(line -> {
            String[] rowSplt = line.split("\t");
            Brand brand = brandRepository.findByBrandId(brandRepository.findIdByCdfBrandId(rowSplt[4]));
            Merchant merchant = merchantRepository
                    .findByMerchantId(merchantRepository.findIdByCdfMerchantId(rowSplt[5]));
            Tenant tenant = tenantRepository.findByName(rowSplt[6]);
            DateFormat converter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            Timestamp fromTime = Timestamp.valueOf(rowSplt[2]);
            Timestamp toTime = Timestamp.valueOf(rowSplt[3]);
            Date parsedFromDate = new Date();
            Date parsedToDate = new Date();
            try {
                parsedFromDate = dateFormat.parse(converter.format(fromTime));
                parsedToDate = dateFormat.parse(converter.format(toTime));
            } catch (ParseException e) {
                e.printStackTrace();
            }
            return new Offer(rowSplt[0], rowSplt[1], new Timestamp(parsedFromDate.getTime()),
                    new Timestamp(parsedToDate.getTime()), brand, merchant, tenant, rowSplt[7], rowSplt[8]);
        }).collect(Collectors.toList());
        offers.forEach(offer -> offerRepository.save(offer));
        fileReader.close();

        // insert into offer_redeem_outlets
        offerRepository.truncateOfferRedeemOutlets();
        offerRepository.insertOfferRedeemOutlets();

        // update status of offers,outlets,brands,merchants
        offerRepository.updateOfferStatusActive();
        offerRepository.updateOfferStatusPending();
        offerRepository.updateOfferStatusExpired();
        offerRepository.updateOutletStatusActive();
        offerRepository.updateOutletStatusInactive();
        offerRepository.updateBrandStatusActive();
        offerRepository.updateBrandStatusInactive();
        offerRepository.updateMerchantStatusActive();
        offerRepository.updateMerchantStatusInactive();

        return new ResponseEntity<>("Offer file successfully uploaded", HttpStatus.OK);
    }
}    