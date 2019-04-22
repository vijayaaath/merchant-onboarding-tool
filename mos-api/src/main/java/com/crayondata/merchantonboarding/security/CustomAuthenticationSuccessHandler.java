package com.crayondata.merchantonboarding.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.crayondata.merchantonboarding.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class CustomAuthenticationSuccessHandler  implements AuthenticationSuccessHandler {
	@Autowired
	private UserRepository userRepository;

	private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
	public void onAuthenticationSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {
        //set our response to OK status
		response.getWriter().write(new ObjectMapper().writeValueAsString(userRepository.findByEmail(authentication.getName())));
		response.setStatus(HttpServletResponse.SC_OK);

	}
}