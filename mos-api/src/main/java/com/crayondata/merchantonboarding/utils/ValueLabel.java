package com.crayondata.merchantonboarding.utils;

public class ValueLabel {
	 Long value;
	 String label;
	    
	    public ValueLabel(Long id, String name) {
	        this.value = id;
	        this.label = name;
	    }
	    
		public Long getValue() {
			return value;
		}
		public void setValue(Long value) {
			this.value = value;
		}
		public String getLabel() {
			return label;
		}
		public void setLabel(String label) {
			this.label = label;
		}
	    
}
