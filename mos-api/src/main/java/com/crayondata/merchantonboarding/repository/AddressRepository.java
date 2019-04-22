package com.crayondata.merchantonboarding.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.crayondata.merchantonboarding.model.Address;

public interface AddressRepository extends PagingAndSortingRepository<Address, Long> {
    Address findByAddressId(@Param("id") Long id);

    @Query(value = "select address_id from address where cdf_address_id = ?1 ;", nativeQuery = true)
    Long findIdByCdfId(String cdfId);
}

