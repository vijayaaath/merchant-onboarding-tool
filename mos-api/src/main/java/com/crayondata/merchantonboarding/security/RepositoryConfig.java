package com.crayondata.merchantonboarding.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

import com.crayondata.merchantonboarding.model.Brand;
import com.crayondata.merchantonboarding.model.Merchant;
import com.crayondata.merchantonboarding.model.Offer;
import com.crayondata.merchantonboarding.model.Outlet;

@Configuration
public class RepositoryConfig extends RepositoryRestConfigurerAdapter {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(Merchant.class);
        config.exposeIdsFor(Brand.class);
        config.exposeIdsFor(Outlet.class);
        config.exposeIdsFor(Offer.class);
    }
}
