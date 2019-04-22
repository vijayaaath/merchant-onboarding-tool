package com.crayondata.merchantonboarding.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.crayondata.merchantonboarding.model.ErrorWarning;
import com.crayondata.merchantonboarding.model.Merchant;
import com.crayondata.merchantonboarding.validator.MandatoryValidator;
import com.crayondata.merchantonboarding.validator.RegexValidator;
import com.crayondata.merchantonboarding.validator.URLValidator;

public class MerchantsValidate {
	public List<ErrorWarning> merchantValidate(Merchant merchant) throws Exception {
		List<ErrorWarning> merchantErrs = new ArrayList<ErrorWarning>();
		
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream("validation-files/merchant.txt");
		
		InputStreamReader streamReader = new InputStreamReader(is, StandardCharsets.UTF_8);
		BufferedReader reader = new BufferedReader(streamReader);
		for (String line; (line = reader.readLine()) != null;) {
			try{
				if (!line.startsWith("#")) {
					ErrorWarning errWarn = new ErrorWarning();
					String[] splts = line.split(",", 4);
					String inputVal = null;
					if (splts[0].equalsIgnoreCase("businessTitle"))
						inputVal = merchant.getBusinessTitle();
					else if (splts[0].equalsIgnoreCase("businessType"))
						inputVal = merchant.getBusinessType();
					else if (splts[0].equalsIgnoreCase("commercialModel"))
						inputVal = merchant.getCommercialModel();
					else if (splts[0].equalsIgnoreCase("contactPerson"))
						inputVal = merchant.getContactPerson();
					else if (splts[0].equalsIgnoreCase("email"))
						inputVal = merchant.getEmail();
					else if (splts[0].equalsIgnoreCase("name"))
						inputVal = merchant.getName();
					else if (splts[0].equalsIgnoreCase("phoneNumber"))
						inputVal = merchant.getPhoneNumber();
					else if (splts[0].equalsIgnoreCase("tenantName"))
						inputVal = merchant.getTenantName();

					if (splts[2].equalsIgnoreCase("mandatory"))
						errWarn = merchantMandatory(inputVal, null, splts[0]);
					else if (splts[2].equalsIgnoreCase("regex"))
						errWarn = merchantRegex(inputVal, splts[3], splts[0]);
					else if (splts[2].equalsIgnoreCase("urlvalidator"))
						errWarn = merchantUrl(inputVal, null, splts[0]);

					if (errWarn.getValidateError() != null) {
						errWarn.setWarning(splts[1]);
						merchantErrs.add(errWarn);
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return merchantErrs;
	}
	
	public ErrorWarning merchantMandatory(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = MandatoryValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
	
	public ErrorWarning merchantRegex(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = RegexValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
	
	public ErrorWarning merchantUrl(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		inputList.add(input);
		ErrorWarning errWarn = URLValidator.validate(inputList,matchValue, column);
		return errWarn;
	}
}
