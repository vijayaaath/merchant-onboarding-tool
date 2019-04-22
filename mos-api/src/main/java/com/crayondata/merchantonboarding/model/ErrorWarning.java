package com.crayondata.merchantonboarding.model;

public class ErrorWarning {
	private String error;
	private String warning;
	public String getValidateError() {
		return error;
	}
	public void setValidateError(String error) {
		this.error = error;
	}
	public String getWarning() {
		return warning;
	}
	public void setWarning(String warning) {
		this.warning = warning;
	}
	
}
