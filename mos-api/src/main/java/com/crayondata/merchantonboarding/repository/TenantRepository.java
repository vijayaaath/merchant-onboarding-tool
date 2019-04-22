package com.crayondata.merchantonboarding.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.crayondata.merchantonboarding.model.Tenant;

public interface TenantRepository extends PagingAndSortingRepository<Tenant, String> {
	Tenant findByName(String role);
}
