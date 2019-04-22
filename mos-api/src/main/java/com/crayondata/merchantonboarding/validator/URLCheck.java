package com.crayondata.merchantonboarding.validator;

import java.net.URL;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.URI;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.HeadMethod;

public class URLCheck {
	static transient public MultiThreadedHttpConnectionManager conMgr = new MultiThreadedHttpConnectionManager();
	static transient public HttpClient httpClient = new HttpClient(conMgr);

	public static void main(String[] args) {
		try {
			String escaprUrl = "https://dpimages.crayondata.com/high-res-image/activities/ACTGEN0001.jpg";
			URI uri = new URI(args[0]);
			String validateUrl = "https://hdfc-stage-ea.testmaya.com/";
			//String validateUrl = "https://www.garuda-indonesia.com/sg/en/special-offers/sales-promotion/fly-from-singapore-to-indonesia-with-5-Star-airlines.page?";
			escaprUrl = uri.getEscapedURI();
			URL u = new URL(escaprUrl);
			HeadMethod headMethod = new HeadMethod(u.toString());
			headMethod.addRequestHeader("User-Agent",
					"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0");
			if (!validateUrl.isEmpty()) {
				headMethod.addRequestHeader("Referer", validateUrl);
			}
			httpClient.executeMethod(headMethod);
			int res = headMethod.getStatusCode();
			System.out.println("res : " + res);
			headMethod.releaseConnection();
			if (res / 100 != 2) {
				System.out.println("inside get");
				GetMethod getMethod = new GetMethod(u.toString());
				getMethod.addRequestHeader("User-Agent",
						"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0");
				if (!validateUrl.isEmpty()) {
					headMethod.addRequestHeader("Referer", validateUrl);
				}
				httpClient.executeMethod(getMethod);
				res = getMethod.getStatusCode();
				getMethod.releaseConnection();
			}

			String code = Integer.toString(res);
			System.out.println("code : " + code);
			if (!(code.startsWith("2"))) {
				System.out.println("Error not started with 2");
			}
		} catch (Exception e) {
			e.printStackTrace();

		}

	}
}
