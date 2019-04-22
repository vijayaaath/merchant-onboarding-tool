package com.crayondata.merchantonboarding.validator;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

//import org.codehaus.jettison.json.JSONException;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class DateValidator implements Serializable  {
	public static ErrorWarning validate(List<Object> input, String[] matchValue, String column) throws Exception, java.text.ParseException {
		
		ErrorWarning errWarn = new ErrorWarning();
		String errors = null;
		/*
		 * Date Format
		 * yyyy-MM-dd'T'HH:mm:ss.SSS
		 * yyyy-mm-dd
		 */
		for (Object inputSplit : input) {
			if(inputSplit == null || inputSplit.toString() == "valuenotexist" || inputSplit.toString().isEmpty())
			{
				continue;
			}
			try
			{
				Date date = null;
				SimpleDateFormat sdf = new SimpleDateFormat(matchValue[0]);
				date = sdf.parse(inputSplit.toString());
				if (!inputSplit.equals(sdf.format(date))) {
					date = null;
				}
				if (date == null) {
					// Invalid date format
					String error = column + ",datecheck," + matchValue[0] + " Error value:" + inputSplit;
					if (errors == null)
						errors = error;
					else
						errors = errors + " |\u0004| " + error;
				}
			}
			catch(Exception e)
			{
				String error = column + ",datecheck," + matchValue[0] + " Error value:" + inputSplit;
				if (errors == null)
					errors = error;
				else
					errors = errors + " |\u0004| " + error;
			}
	}
		errWarn.setValidateError(errors);
		return errWarn;
		
	}
	
}
