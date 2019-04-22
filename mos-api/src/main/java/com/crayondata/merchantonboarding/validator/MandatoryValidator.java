package com.crayondata.merchantonboarding.validator;

import java.io.Serializable;
import java.util.List;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class MandatoryValidator implements Serializable  {
	public static ErrorWarning validate(List<Object> input, String[] matchValue, String column) throws Exception {
		ErrorWarning errWarn = new ErrorWarning();
		String errors = null;
		
		for (Object inputSplit : input) {
			if(inputSplit == null || inputSplit.toString() == "valuenotexist" || inputSplit == "" || inputSplit.toString().isEmpty())
			{
				String error = column + ",mandatory" + " Error value: " + "Field is empty";
				if (errors == null)
				errors = error;
			}
		}
		if(input.isEmpty())
		{
			String error = column + ",mandatory" + " Error value: " + "Field is empty";
			if (errors == null)
			errors = error;
		}
		errWarn.setValidateError(errors);
		return errWarn;
		
	}
}
