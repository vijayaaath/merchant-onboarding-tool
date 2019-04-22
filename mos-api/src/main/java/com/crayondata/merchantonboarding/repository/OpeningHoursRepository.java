package com.crayondata.merchantonboarding.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.crayondata.merchantonboarding.model.OpeningHours;

public interface OpeningHoursRepository extends PagingAndSortingRepository<OpeningHours, Long>{
	OpeningHours findByOpeningHoursId(@Param("id") Long id);
	
	@Query(value = "select opening_hours_id from opening_hours where cdf_opening_hours_id = ?1 ;",nativeQuery = true)
	Long findIdByCdfOpeningHoursId(String cdfOpeningHoursId);
}


