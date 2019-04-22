package com.crayondata.merchantonboarding.controller;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.crayondata.merchantonboarding.model.ActiveEntities;
import com.crayondata.merchantonboarding.repository.OfferRepository;

@Controller
public class DashboardController {
	@Autowired
    private OfferRepository offerRepository;
	
    @RequestMapping(value = "/api/stats/entities", method = RequestMethod.GET)
    @ResponseBody
    public ActiveEntities getActiveEntities(@RequestParam(value="status",required=true) String status, @RequestParam(value="entity",required=false) String entity)
    {	
		ActiveEntities entities = new ActiveEntities();
		Object count = null;
		if (entity == null) {
			count = offerRepository.findMerchantEntities();
			entities.setMerchants(Long.parseLong(count.toString()));
			count = offerRepository.findBrandEntities();
			entities.setBrands(Long.parseLong(count.toString()));
			count = offerRepository.findOutletEntities();
			entities.setOutlets(Long.parseLong(count.toString()));
			count = offerRepository.findActiveOfferEntitiesCount();
			entities.setOffers(Long.parseLong(count.toString()));
		} else if(entity.equalsIgnoreCase("merchant")){
			count = offerRepository.findMerchantEntities();
			entities.setMerchants(Long.parseLong(count.toString()));
		} else if(entity.equalsIgnoreCase("brand")){
			count = offerRepository.findBrandEntities();
			entities.setBrands(Long.parseLong(count.toString()));
		} else if(entity.equalsIgnoreCase("outlet")){
			count = offerRepository.findOutletEntities();
			entities.setOutlets(Long.parseLong(count.toString()));
		} else if(entity.equalsIgnoreCase("offer")){
			count = offerRepository.findActiveOfferEntitiesCount();
			entities.setOffers(Long.parseLong(count.toString()));
		}
        return entities;
    }
	
    @RequestMapping(value = "/api/stats/offers", method = RequestMethod.POST)
    @ResponseBody
	public Map<String,Long> getPendingOffers(@RequestParam(value = "status", required = true) String status,
			@RequestParam(value = "distribution", required = false, defaultValue = "false") String distribution,
			@RequestBody(required = false) JSONObject jObject) {
		Timestamp timeStamp = null;
		Object list = null;
		Calendar cal = Calendar.getInstance();
		Map<String,Long> itemDistribution = new LinkedHashMap<>();
				
		if (distribution.equals("false")) {
			if (jObject == null) {
				timeStamp = new Timestamp(System.currentTimeMillis());
				cal.setTime(timeStamp);
				cal.add(Calendar.MONTH, 1);
				timeStamp = new Timestamp(cal.getTimeInMillis());
				System.out.println("Time : " + timeStamp);
			} else {
				timeStamp = Timestamp.valueOf(jObject.get("time").toString());
			}
			if (status.equalsIgnoreCase("pending"))
				list = offerRepository.findPendingOffersCount(new Timestamp(System.currentTimeMillis()));
			else if (status.equalsIgnoreCase("expired"))
				list = offerRepository.findExpiringOffersCount(timeStamp);
			itemDistribution.put("count", Long.parseLong(list.toString()));
		} else{
			Timestamp toTime = null;
			if(jObject == null){
				timeStamp = new Timestamp(System.currentTimeMillis());
			}
			else{
				timeStamp = Timestamp.valueOf(jObject.get("time").toString());
			}
			cal.setTime(timeStamp);
			cal.add(Calendar.MONTH, -3);
			timeStamp = new Timestamp(cal.getTimeInMillis());
			for(int i=0; i<6; i++){
				cal.setTime(timeStamp);
				cal.add(Calendar.MONTH, 1);
				toTime = new Timestamp(cal.getTimeInMillis());
				list = offerRepository.findActiveOffersOverTime(timeStamp, toTime);
				timeStamp = toTime;
				//item.put(monthName[cal.MONTH], list);
				itemDistribution.put(cal.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.getDefault()), Long.parseLong(list.toString()));
			}
		}
		return itemDistribution;
	}

    @RequestMapping(value = "/api/stats/categories", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject getCategoryDistributionByBrands(@RequestParam(value="groupby",required=true) String groupby)
    {	
		List<Object[]> listObject = new ArrayList<Object[]>();
		JSONObject jObject = new JSONObject();
		if(groupby.equalsIgnoreCase("brand"))
			listObject = offerRepository.findCategoryDistributionByBrands();
		else if(groupby.equalsIgnoreCase("offer"))
			listObject = offerRepository.findCategoryDistributionByOffers();
		for(Object[] obj : listObject){
			jObject.put(obj[0].toString(), obj[1].toString());
		}
        return jObject;
    }
}
