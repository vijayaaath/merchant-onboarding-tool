package com.crayondata.merchantonboarding.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.crayondata.merchantonboarding.model.ErrorWarning;
import com.crayondata.merchantonboarding.model.Brand;
import com.crayondata.merchantonboarding.validator.MandatoryValidator;
import com.crayondata.merchantonboarding.validator.RegexValidator;
import com.crayondata.merchantonboarding.validator.URLValidator;

public class BrandsValidate {
	public List<ErrorWarning> brandValidate(Brand brand) throws Exception {
		List<ErrorWarning> brandErrs = new ArrayList<ErrorWarning>();
		
		ClassLoader classloader = Thread.currentThread().getContextClassLoader();
		InputStream is = classloader.getResourceAsStream("validation-files/brand.txt");
		
		InputStreamReader streamReader = new InputStreamReader(is, StandardCharsets.UTF_8);
		BufferedReader reader = new BufferedReader(streamReader);
		for (String line; (line = reader.readLine()) != null;) {
			try{
				if (!line.startsWith("#")) {
					ErrorWarning errWarn = new ErrorWarning();
					String[] splts = line.split(",", 4);
					String inputVal = null;
					if (splts[0].equalsIgnoreCase("category"))
						inputVal = brand.getCategory();
					else if (splts[0].equalsIgnoreCase("email"))
						inputVal = brand.getEmail();
					else if (splts[0].equalsIgnoreCase("name"))
						inputVal = brand.getName();
					else if (splts[0].equalsIgnoreCase("subcategories"))
						inputVal = brand.getSubCategories();
					else if (splts[0].equalsIgnoreCase("tag"))
						inputVal = brand.getTags();
					else if (splts[0].equalsIgnoreCase("url"))
						inputVal = brand.getUrl();

					if (splts[2].equalsIgnoreCase("mandatory"))
						errWarn = brandMandatory(inputVal, null, splts[0]);
					else if (splts[2].equalsIgnoreCase("regex"))
						errWarn = brandRegex(inputVal, splts[3], splts[0]);
					else if (splts[2].equalsIgnoreCase("urlvalidator"))
						errWarn = brandUrl(inputVal, "", splts[0]);

					if (errWarn.getValidateError() != null) {
						errWarn.setWarning(splts[1]);
						brandErrs.add(errWarn);
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return brandErrs;
	}
	
	public ErrorWarning brandMandatory(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = MandatoryValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
	
	public ErrorWarning brandRegex(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		String[] matchArr = new String[1];
		inputList.add(input);
		matchArr[0] = matchValue;
		ErrorWarning errWarn = RegexValidator.validate(inputList, matchArr, column);
		return errWarn;
	}
	
	public ErrorWarning brandUrl(String input, String matchValue, String column) throws Exception{
		List<Object> inputList = new ArrayList<>();
		inputList.add(input);
		ErrorWarning errWarn = URLValidator.validate(inputList,matchValue, column);
		return errWarn;
	}
}
