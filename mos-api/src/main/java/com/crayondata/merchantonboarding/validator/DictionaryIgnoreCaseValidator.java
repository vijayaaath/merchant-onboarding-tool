package com.crayondata.merchantonboarding.validator;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class DictionaryIgnoreCaseValidator implements Serializable  {
	public static ErrorWarning validate(List<Object> input, String[] matchValues, String column,
			String hdfsFilepath) {
		ErrorWarning errWarn = new ErrorWarning();
		//String[] inputSplits = input.split("\\|");
		String errors = null;
		for (int i = 0; i < matchValues.length; i++) {
			matchValues[i] = matchValues[i].toLowerCase();
		}
		for (Object inputSplit : input) {
			if(inputSplit == null || inputSplit.toString() == "valuenotexist" || inputSplit.toString().isEmpty())
			{
				continue;
			}
			String[] splts = inputSplit.toString().split("\\|");
			for (String splt : splts) {
				if (!(Arrays.asList(matchValues).contains(splt.toString().toLowerCase()))) {
					String error = column + ",enumfileignorecase," + hdfsFilepath + " Error value:" + splt;
					if (errors == null)
						errors = error;
					else
						errors = errors + " |\u0004| " + error;
					break;
				}
			}
		}
		errWarn.setValidateError(errors);
		return errWarn;
	}


}
