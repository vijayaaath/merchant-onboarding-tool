package com.crayondata.merchantonboarding.repository;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.crayondata.merchantonboarding.model.Country;

public interface CountryRepository extends PagingAndSortingRepository<Country, Long> {

    List<Country> findByCountry(String city);
}