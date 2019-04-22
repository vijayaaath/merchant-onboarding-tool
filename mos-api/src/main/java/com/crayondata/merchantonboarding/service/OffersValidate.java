package com.crayondata.merchantonboarding.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;


import com.crayondata.merchantonboarding.model.ErrorWarning;
import com.crayondata.merchantonboarding.model.Offer;
import com.crayondata.merchantonboarding.validator.DateValidator;
import com.crayondata.merchantonboarding.validator.MandatoryValidator;
import com.crayondata.merchantonboarding.validator.RegexValidator;

public class OffersValidate {
	public List<ErrorWarning> offerValidate(Offer offer) throws Exception {
		List<ErrorWarning> offerErrs = new ArrayList<ErrorWarning>();
		
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream("validation-files/offer.txt");
		
		InputStreamReader streamReader = new InputStreamReader(is, StandardCharsets.UTF_8);
		BufferedReader reader = new BufferedReader(streamReader);
		for (String line; (line = reader.readLine()) != null;) {
			try{
				if (!line.startsWith("#")) {
					ErrorWarning errWarn = new ErrorWarning();
					String[] splts = line.split(",", 4);
					String inputVal = null;
					if (splts[0].equalsIgnoreCase("shortdesc"))
						inputVal = offer.getShortDesc();
					else if (splts[0].equalsIgnoreCase("longdesc"))
						inputVal = offer.getLongDesc();
					else if (splts[0].equalsIgnoreCase("meddesc"))
						inputVal = offer.getMedDesc();
					else if (splts[0].equalsIgnoreCase("postalcode"))
						inputVal = offer.getPostalCode();
					else if (splts[0].equalsIgnoreCase("promocode"))
						inputVal = offer.getPromoCode();
					else if (splts[0].equalsIgnoreCase("redeemurl"))
						inputVal = offer.getRedeemUrl();
					else if (splts[0].equalsIgnoreCase("validfrom"))
						inputVal = offer.getValidFrom();
					else if (splts[0].equalsIgnoreCase("validto"))
						inputVal = offer.getValidTo();
					else if (splts[0].equalsIgnoreCase("tenantname"))
						inputVal = offer.getTenantName();
					else if (splts[0].equalsIgnoreCase("brandname"))
						inputVal = offer.getBrandName();

					if (splts[2].equalsIgnoreCase("mandatory"))
						errWarn = offerMandatory(inputVal, null, splts[0]);
					else if (splts[2].equalsIgnoreCase("datecheck"))
						errWarn = offerDate(inputVal, splts[3], splts[0]);
					else if (splts[2].equalsIgnoreCase("regex"))
						errWarn = offerRegex(inputVal, splts[3], splts[0]);

					if (errWarn.getValidateError() != null) {
						errWarn.setWarning(splts[1]);
						offerErrs.add(errWarn);
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return offerErrs;
	}
	
	public ErrorWarning offerMandatory(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = MandatoryValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
	
	public ErrorWarning offerRegex(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = RegexValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
	
	public ErrorWarning offerDate(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = DateValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
}
