package com.crayondata.merchantonboarding;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.crayondata.merchantonboarding.model.Role;
import com.crayondata.merchantonboarding.model.Tenant;
import com.crayondata.merchantonboarding.model.User;
import com.crayondata.merchantonboarding.repository.TenantRepository;
import com.crayondata.merchantonboarding.repository.UserRepository;
import com.crayondata.merchantonboarding.security.AuditorAwareImpl;
import com.crayondata.merchantonboarding.security.AuthorizationFilter;
import com.crayondata.merchantonboarding.service.UserService;

@SpringBootApplication
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories
@EnableJpaAuditing(auditorAwareRef="auditorAware")
public class MerchantOnboardingApplication {

	@Value("${allowedOrigins:}")
	private String[] allowedOrigins;
	@Autowired
	private UserService userService;
	@Autowired
	TenantRepository tenantRepository;

	public static void main(String[] args) {

		SpringApplication.run(MerchantOnboardingApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(UserRepository repository) {
		return (args) -> {
			Role role = new Role("ADMIN");
			Tenant tenant = new Tenant("Entertainer","India");
			Set<Role> roles = new HashSet<Role>();
			roles.add(role);
			User user = new User("abc xyz", "abc@xyz.com", "12345", roles, tenant,null);
			User existing = userService.findByEmail("abc@xyz.com");
			if(existing == null){
				userService.save(user,false);
				tenantRepository.save(tenant);
			}
		};
	}

	@Bean
	public FilterRegistrationBean authFilterRegistrationBean() {
		FilterRegistrationBean registration = new FilterRegistrationBean();
		registration.setFilter(new AuthorizationFilter(allowedOrigins));
		registration.addUrlPatterns("/*");
		registration.setName("authFilter");
		registration.setOrder(5);
		return registration;
	}

	@Bean
    public AuditorAware<String> auditorAware() {
        return new AuditorAwareImpl();
    }

}
