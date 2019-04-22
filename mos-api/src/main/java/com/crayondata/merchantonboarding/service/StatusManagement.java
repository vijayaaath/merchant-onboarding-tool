package com.crayondata.merchantonboarding.service;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.crayondata.merchantonboarding.model.Offer;
import com.crayondata.merchantonboarding.model.Outlet;
import com.crayondata.merchantonboarding.repository.OfferRepository;

@Configuration
@EnableScheduling
public class StatusManagement {
	
	@Autowired
    private OfferRepository offerRepository;
	
	@Scheduled(fixedDelay = 1000*60*60*24)
	public void scheduleFixedDelayTask() {
	    List<Offer> activeOffers = offerRepository.findOfferByStatus("active");
	    List<Offer> pendingOffers = offerRepository.findOfferByStatus("pending");
	    Calendar cal = Calendar.getInstance();
	    Timestamp currentTime = new Timestamp(cal.getTimeInMillis());
	    for(Offer activeOffer : activeOffers){
	    	Timestamp toTime = Timestamp.valueOf(activeOffer.getValid_to());
	    	if(currentTime.after(toTime)){
	    		Object obj = null;
	    		long brandId = activeOffer.getBrand().getBrandId();
	        	long merchantId = activeOffer.getMerchant().getMerchantId();
	    		offerRepository.updateOfferStatus("expired", activeOffer.getOfferId());
	    		Set<Outlet> outlets = activeOffer.getOfferRedeemOutlets();
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
	    	}
	    }
	    
	    for(Offer pendingOffer : pendingOffers){
	    	Timestamp fromTime = Timestamp.valueOf(pendingOffer.getValid_from());
	    	if(currentTime.after(fromTime)){
	    		long brandId = pendingOffer.getBrand().getBrandId();
	        	long merchantId = pendingOffer.getMerchant().getMerchantId();
	    		offerRepository.updateOfferStatus("active", pendingOffer.getOfferId());
	    		Set<Outlet> outlets = pendingOffer.getOfferRedeemOutlets();
	        	for(Outlet outlet : outlets){
	        		offerRepository.updateOutletStatus("active",outlet.getOutletId());
	        	}
	    		offerRepository.updateBrandStatus("active",brandId);
	    		offerRepository.updateMerchantStatus("active",merchantId);
	    	}
	    }
	}
}
