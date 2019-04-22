package com.crayondata.merchantonboarding.validator;

import java.io.Serializable;
import java.util.List;
import java.util.regex.Pattern;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class RegexValidator implements Serializable  {
	public static ErrorWarning validate(List<Object> input, String[] matchValue, String column) throws Exception {
		ErrorWarning errWarn = new ErrorWarning();
		Pattern pattern = Pattern.compile(matchValue[0]);
		String errors = null;
		//String[] inputSplits = input.split("\\|");
		for (Object inputSplit : input) {
			if(inputSplit == null || inputSplit.toString() == "valuenotexist" || inputSplit.toString().isEmpty())
			{
				continue;
			}
			try {
				if (!(pattern.matcher(String.valueOf(inputSplit)).matches())) {
					String error = column + ",regex," + matchValue[0] + " Error value:" + inputSplit;
					if (errors == null)
						errors = error;
					else
						errors = errors + " |\u0004| " + error;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		errWarn.setValidateError(errors);
		return errWarn;
	}
}
