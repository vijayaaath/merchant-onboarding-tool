package com.crayondata.merchantonboarding.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.crayondata.merchantonboarding.model.Address;
import com.crayondata.merchantonboarding.model.ErrorWarning;
import com.crayondata.merchantonboarding.validator.MandatoryValidator;
import com.crayondata.merchantonboarding.validator.RegexValidator;

public class AddressValidate {
	public List<ErrorWarning> addressValidate(Address address) throws Exception {
		List<ErrorWarning> addressErrs = new ArrayList<ErrorWarning>();
		
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream("validation-files/address.txt");
		
		InputStreamReader streamReader = new InputStreamReader(is, StandardCharsets.UTF_8);
		BufferedReader reader = new BufferedReader(streamReader);
		for (String line; (line = reader.readLine()) != null;) {
			try{
				if (!line.startsWith("#")) {
					ErrorWarning errWarn = new ErrorWarning();
					String[] splts = line.split(",", 4);
					String inputVal = null;
					if (splts[0].equalsIgnoreCase("country"))
						inputVal = address.getCountry();
					else if (splts[0].equalsIgnoreCase("postalcode"))
						inputVal = address.getPostalCode();
					else if (splts[0].equalsIgnoreCase("streetno"))
						inputVal = address.getStreetNo();
					else if (splts[0].equalsIgnoreCase("unitno"))
						inputVal = address.getUnitNo();
					else if (splts[0].equalsIgnoreCase("cityname"))
						inputVal = address.getCityName();
					else if (splts[0].equalsIgnoreCase("floor"))
						inputVal = address.getFloor();
					else if (splts[0].equalsIgnoreCase("locality"))
						inputVal = address.getLocality();

					if (splts[2].equalsIgnoreCase("mandatory"))
						errWarn = addressMandatory(inputVal, null, splts[0]);
					else if (splts[2].equalsIgnoreCase("regex"))
						errWarn = addressRegex(inputVal, splts[3], splts[0]);

					if (errWarn.getValidateError() != null) {
						errWarn.setWarning(splts[1]);
						addressErrs.add(errWarn);
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return addressErrs;
	}
	
	public ErrorWarning addressMandatory(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = MandatoryValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
	
	public ErrorWarning addressRegex(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = RegexValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
}	
