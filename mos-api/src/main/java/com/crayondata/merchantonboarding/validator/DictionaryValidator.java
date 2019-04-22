package com.crayondata.merchantonboarding.validator;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class DictionaryValidator implements Serializable  {
	public static ErrorWarning validate(List<Object> input, String[] matchValues, String column, String hdfsFilepath) {
		//String[] inputSplits = input.split("\\|");
		ErrorWarning errWarn = new ErrorWarning();
		String errors = null;
		for (Object inputSplit : input) {
			if(inputSplit == null || inputSplit.toString() == "valuenotexist" || inputSplit.toString().isEmpty()){
				continue;
			}
			String[] splts = inputSplit.toString().split("\\|");
			for (String splt : splts) {
				if (!(Arrays.asList(matchValues).contains(splt))) {
					String error = column + ",enumfile," + hdfsFilepath + " Error value:" + splt;
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
