package com.crayondata.merchantonboarding.validator;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class EnumIgnoreCaseValidator implements Serializable  {
	public static ErrorWarning validate(List<Object> input, String[] matchValue, String column)
			throws Exception {
		ErrorWarning errWarn = new ErrorWarning();
		String errors = null;
		Set<String> values = new HashSet<String>();
		String[] enumAttributes = matchValue[0].split("\\|");
		//String[] inputSplits = input.split("\\|");
		for (String enumAttribute : enumAttributes) {
			values.add(enumAttribute.toLowerCase());
		}
		for (Object inputSplit : input) {
			if(inputSplit == null || inputSplit.toString() == "valuenotexist" || inputSplit.toString().isEmpty()){
				continue;
			}
			String[] inputSplits = inputSplit.toString().split("\\|");
			for(String split : inputSplits){
				if (!(values.contains(split.toString().toLowerCase()))) {
					String error = column + ",enumignorecase," + matchValue[0] + " Error value:" + split;
					if (errors == null)
						errors = error;
					else
						errors = errors + " |\u0004| " + error;
					}
			}
		}
		errWarn.setValidateError(errors);
		return errWarn;
	}


}
