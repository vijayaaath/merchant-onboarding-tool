package com.crayondata.merchantonboarding.validator;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class DuplicateValidator implements Serializable{
	public static ErrorWarning validate(List<Object> input, String column) throws Exception {
		ErrorWarning errWarn = new ErrorWarning();
		String errors = null;
		Set<String> values = new HashSet<String>();
		for (Object inputSplit : input) {
			if(inputSplit == null || inputSplit.toString() == "valuenotexist" || inputSplit.toString().isEmpty()){
				continue;
			}
			String[] inputSplits = input.toString().split("\\|");
			for(String split : inputSplits){
				String inputVal = null;
				if(split.startsWith("["))
					inputVal = split.substring(1, split.length());
				else if(split.endsWith("]"))
					inputVal = split.substring(0, split.length()-1);
				else
					inputVal = split;
				if (values.add(inputVal.toLowerCase().trim()) == false) {
					//String error = column + ",duplicatecheck" + " Error value:" + inputVal;
					errors = column + ",duplicatecheck" + " Error value:" + inputVal;
					break;
					/*if (errors == null)
						errors = error;
					else
						errors = errors + " |\u0004| " + error;*/
				}
			}
		}
		errWarn.setValidateError(errors);
		return errWarn;
	}
}

