package com.crayondata.merchantonboarding.validator;

import java.io.Serializable;
import java.util.List;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class NumericValidator implements Serializable  {
	public static ErrorWarning validate(List<Object> inputval, String[] matchValue, String column , String matchType)
            throws Exception {
        String errors = null;
        ErrorWarning errWarn = new ErrorWarning();
        for (Object inputvalue : inputval) {
        	if(inputvalue == null || inputvalue.toString() == "valuenotexist" || inputvalue.toString().isEmpty())
			{
				continue;
			}
        float compareVal = Float.parseFloat(matchValue[0]);
        float input = 0;
        
        if (inputvalue.toString().trim()==null || inputvalue.toString().isEmpty()) {
            String error = column + ","+ matchType + "," + matchValue[0] + " Error value:" + inputvalue;
            if (errors == null)
                errors = error;
            else
                errors = errors + " |\u0004| " + error;
        }
        else{ 
        try{	
        input = Float.parseFloat(inputvalue.toString());
        }
        catch(Exception e)
        {
        	 String error = column + ","+ matchType + "," + matchValue[0] + " Error value:" + inputvalue;
             if (errors == null)
                 errors = error;
             else
                 errors = errors + " |\u0004| " + error;
        }
        if(matchType.equals(">=")) {
            if (!(input >= compareVal)) {
                String error = column + ","+ matchType+ "," + matchValue[0] + " Error value:" + input;
                if (errors == null)
                    errors = error;
                else
                    errors = errors + " |\u0004| " + error;
            }
        } if(matchType.equals("<=")) {
            if (!(input <= compareVal)) {
                String error = column + ","+ matchType + "," + matchValue[0] + " Error value:" + input;
                if (errors == null)
                    errors = error;
                else
                    errors = errors + " |\u0004| " + error;
            }
        } if(matchType.equals(">")) {
            if (!(input > compareVal)) {
                String error = column + ","+ matchType + "," + matchValue[0] + " Error value:" + input;
                if (errors == null)
                    errors = error;
                else
                    errors = errors + " |\u0004| " + error;
            }
        } if(matchType.equals("<")) {
            if (!(input < compareVal)) {
                String error = column + ","+ matchType + "," + matchValue[0] + " Error value:" + input;
                if (errors == null)
                    errors = error;
                else
                    errors = errors + " |\u0004| " + error;
            }
        }
        }
        }
        errWarn.setValidateError(errors);
        return errWarn;
    }

}
