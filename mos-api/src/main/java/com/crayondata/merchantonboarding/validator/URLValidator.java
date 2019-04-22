package com.crayondata.merchantonboarding.validator;

import java.io.Serializable;
import java.net.URL;
import java.util.List;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.URI;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.HeadMethod;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class URLValidator implements Serializable  {
    static transient public MultiThreadedHttpConnectionManager conMgr =new MultiThreadedHttpConnectionManager(); 
    static transient public HttpClient httpClient = new HttpClient(conMgr);
	public static ErrorWarning validate(List<Object> input, String validateUrl, String column)  {
		//String[] inputSplits = input.split("\\|");
		ErrorWarning errWarn = new ErrorWarning();
		String errors = null;
		for (Object inputSplit : input) {
			if(inputSplit == null || inputSplit.toString() == "valuenotexist" || inputSplit.toString().isEmpty())
			{
				continue;
			}
			try {
				String escaprUrl = "";
				URI uri = new URI(inputSplit.toString());
				escaprUrl = uri.getEscapedURI();
				URL u = new URL(escaprUrl);	
				HeadMethod headMethod = new HeadMethod(u.toString());
				headMethod.addRequestHeader("User-Agent","Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0");
                if (!validateUrl.isEmpty()) {
                	headMethod.addRequestHeader("Referer", validateUrl);
                }
    			httpClient.executeMethod(headMethod);
                int res = headMethod.getStatusCode();
                headMethod.releaseConnection();
                if (res / 100 != 2 || res / 100 != 3) {
                                 	 GetMethod getMethod = new GetMethod(u.toString());
                                  	 getMethod.addRequestHeader("User-Agent","Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0");
                                  	if (!validateUrl.isEmpty()) {
                                    	headMethod.addRequestHeader("Referer", validateUrl);
                                    }
                                  	 httpClient.executeMethod(getMethod);
                                 	 res = getMethod.getStatusCode();
                                 	getMethod.releaseConnection();
                                  }
				
				String code = Integer.toString(res);

				if (!(code.startsWith("2") || code.startsWith("3"))) {
					String error ="";
					/*if(!validateUrl.isEmpty())
					{
					error = column + ",urlreferrer," + validateUrl + " Error value:" + inputSplit+ " Status Code:"+code;
					}
					else
					{*/
						error = column + ",urlreferrer" + " Error value:" + inputSplit+ " Status Code:"+code;
					//}
					if (errors == null)
						errors = error;
					else
						errors = errors + " |\u0004| " + error;
				} 
			} catch (Exception e) {
				String error = "";
				/*if(!validateUrl.isEmpty())
				{
				error = column + ",urlreferrer," + validateUrl + " Error value:" + inputSplit;
				}
				else
				{*/
					error = column + ",urlreferrer" + " Error value:" + inputSplit;
				//}
				if (errors == null)
					errors = error;
				else
					errors = errors + error;
			}
		}
		errWarn.setValidateError(errors);
		return errWarn;
	}
}
