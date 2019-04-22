package com.crayondata.merchantonboarding.validator;


import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.URI;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.HeadMethod;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.crayondata.merchantonboarding.model.ErrorWarning;

public class ImageCheck{
    static transient public MultiThreadedHttpConnectionManager conMgr =new MultiThreadedHttpConnectionManager(); 
    static transient public HttpClient httpClient = new HttpClient(conMgr);
    
    public static void main(String[] args){
    	List<Object> list = new ArrayList<Object>();
    	list.add("http://www.tanglindentalsurgeons.com");
    	String[] matchValue = new String[1];
    	//matchValue[0] = args[0];
    	validate(list,"col","https://hdfc-stage-ea.testmaya.com/");
    }
    
	public static ErrorWarning validate(List<Object> input , String column, String referrer) {
		//String[] inputSplits = input.split("\\|");
		ErrorWarning errWarn = new ErrorWarning();
		String errors = null;
		String warnings = null;
		JSONObject jObject = new JSONObject();
		JSONParser parse = new JSONParser();
		long widthCheck = 0;
		long heightCheck = 0;
		long sizeCheck = 0;
		try{
			//jObject = (JSONObject) parse.parse(matchValue[0]);
			/*widthCheck = (long) jObject.get("width");
			heightCheck = (long) jObject.get("height");
			sizeCheck = (long) jObject.get("size");
			*/
			widthCheck = 0;
			heightCheck = 0;
			sizeCheck = 20;
		}catch(Exception e){
			e.printStackTrace();
		}
		
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
                if (!referrer.isEmpty()) {
                	headMethod.addRequestHeader("Referer", referrer);
                }
    			httpClient.executeMethod(headMethod);
                int res = headMethod.getStatusCode();

                headMethod.releaseConnection();
                System.out.println("code 1 : " + res);  
                if (res / 100 != 2) {
                	System.out.println("second");
               	 GetMethod getMethod = new GetMethod(u.toString());
               	 getMethod.addRequestHeader("User-Agent","Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0");
               	if (!referrer.isEmpty()) {
                	headMethod.addRequestHeader("Referer", referrer);
                }
               	 httpClient.executeMethod(getMethod);
               	 res = getMethod.getStatusCode();
               	getMethod.releaseConnection();
               }
                        System.out.println("code 2 : " + res);        
				String code = Integer.toString(res);
				int width = 0;
				int height = 0;
				if (!(code.startsWith("2"))) {
					String error = "";
					/*if(!referrer.isEmpty())
					{
					error = column + ",imagefilereferrer," + referrer + " Error value:" + inputSplit + " Status Code:"+code;
					}
					else
					{*/
					//,{"width":0,"height":0,"size":100}
						error = column + ",imagefilereferrer" + ",{\"width\":" +widthCheck+ ",\"height\":" +heightCheck+ ",\"size\":" +sizeCheck + ",\"warning\":\"image size greater than " + sizeCheck + " KB\"}" + " Error value:" + inputSplit+ " Status Code:"+code;
						System.out.println("error 1");
					//}
					if (errors == null)
						errors = error;
					else
						errors = errors + " |\u0004| " + error;
				} else {
					try (InputStream stream = u.openStream()) {
						try (ImageInputStream inputStream = ImageIO.createImageInputStream(stream)) {
							
							ImageReader reader = ImageIO.getImageReaders(inputStream).next();
							try {
								reader.setInput(inputStream);
								width = reader.getWidth(0);
								height = reader.getHeight(0);
							} finally {
								reader.dispose();
							}
						}
					}
					if (widthCheck != 0 && heightCheck != 0) {
						if ((width < widthCheck) || (height < heightCheck)) {
							String error = "";
							/*if (!referrer.isEmpty()) {
								error = column + ",imagefilereferrer," + referrer + " Error value:" + inputSplit;
							} else {*/
								error = column + ",imagefilereferrer" + ",{\"width\":" +widthCheck+ ",\"height\":" +heightCheck+ ",\"size\":" +sizeCheck + ",\"warning\":\"image size greater than " + sizeCheck  + " KB\"}" + " Error value:" + inputSplit;
							//}
							if (errors == null)
								errors = error;
							else
								errors = errors + " |\u0004| " + error;
							System.out.println("error 2");
						}
					}
					if(sizeCheck!=0){
						String len = headMethod.getResponseHeader("Content-Length").getValue();
						long imageSizeKB = Long.parseLong(len)/1000;
						if(imageSizeKB > sizeCheck){
							String error = "";
							String warning = "";
							/*if (!referrer.isEmpty()) {
								error = column + ",imagefilereferrer," + referrer + " Error value:" + inputSplit;
							} else {*/
								warning = column + ",imagefilereferrer" + ",{\"width\":" +widthCheck+ ",\"height\":" +heightCheck+ ",\"size\":" +sizeCheck + ",\"warning\":\"image size greater than " + sizeCheck + " KB\"}" + " Error value: image size greater than " + sizeCheck + " KB";
							//}
							if (warnings == null)
								warnings = warning;
							else
								warnings = warnings + " |\u0004| " + warning;
							System.out.println("warning");
						}
					}
					
				}
			} catch (Exception e) {
				String error = "";
				/*if(!referrer.isEmpty())
				{
				error = column + ",imagefilereferrer," + referrer + " Error value:" + inputSplit;
				}
				else
				{*/
					error = column + ",imagefilereferrer" + ",{\"width\":" +widthCheck+ ",\"height\":" +heightCheck+ ",\"size\":" +sizeCheck + ",\"warning\":\"image size greater than " + sizeCheck + " KB\"}" + " Error value:" + inputSplit;
				//}
				if (errors == null)
					errors = error;
				else
					errors = errors + error;
				System.out.println("error 4");
			}
		}
		errWarn.setValidateError(errors);
		errWarn.setWarning(warnings);
		return errWarn;
	}
}

