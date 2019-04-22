package com.crayondata.merchantonboarding.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.crayondata.merchantonboarding.model.ErrorWarning;
import com.crayondata.merchantonboarding.model.Outlet;
import com.crayondata.merchantonboarding.validator.MandatoryValidator;
import com.crayondata.merchantonboarding.validator.RegexValidator;
import com.crayondata.merchantonboarding.validator.URLValidator;

public class OutletsValidate {
	public List<ErrorWarning> outletValidate(Outlet outlet) throws Exception {
		List<ErrorWarning> outletErrs = new ArrayList<ErrorWarning>();
		
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream("validation-files/outlet.txt");
		
		InputStreamReader streamReader = new InputStreamReader(is, StandardCharsets.UTF_8);
		BufferedReader reader = new BufferedReader(streamReader);
		for (String line; (line = reader.readLine()) != null;) {
			try{
				if (!line.startsWith("#")) {
					ErrorWarning errWarn = new ErrorWarning();
					String[] splts = line.split(",", 4);
					String inputVal = null;
					if (splts[0].equalsIgnoreCase("locationid"))
						inputVal = outlet.getLocationId();
					else if (splts[0].equalsIgnoreCase("phone"))
						inputVal = outlet.getPhone();
					else if (splts[0].equalsIgnoreCase("url"))
						inputVal = outlet.getUrl();
					else if (splts[0].equalsIgnoreCase("tenantname"))
						inputVal = outlet.getTenantName();
					else if (splts[0].equalsIgnoreCase("brandname"))
						inputVal = outlet.getBrandName();

					if (splts[2].equalsIgnoreCase("mandatory"))
						errWarn = outletMandatory(inputVal, null, splts[0]);
					else if (splts[2].equalsIgnoreCase("regex"))
						errWarn = outletRegex(inputVal, splts[3], splts[0]);
					else if (splts[2].equalsIgnoreCase("urlvalidator"))
						errWarn = outletUrl(inputVal, "", splts[0]);

					if (errWarn.getValidateError() != null) {
						errWarn.setWarning(splts[1]);
						outletErrs.add(errWarn);
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return outletErrs;
	}
	
	public ErrorWarning outletMandatory(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = MandatoryValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
	
	public ErrorWarning outletRegex(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = RegexValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
	
	public ErrorWarning outletUrl(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		inputList.add(input);
		ErrorWarning errWarn = URLValidator.validate(inputList,matchValue, column);
		return errWarn;
	}
}
