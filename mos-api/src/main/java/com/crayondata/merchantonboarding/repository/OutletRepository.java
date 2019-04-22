
package com.crayondata.merchantonboarding.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.crayondata.merchantonboarding.model.Outlet;

@Transactional
public interface OutletRepository extends PagingAndSortingRepository<Outlet, Long>{
	Outlet findByOutletId(@Param("id") Long id);

	 public static final String FIND_OUTLETS_BY_NAME = "SELECT outlet_id, location_id FROM outlet WHERE location_id like %:name%";
	 public static final String FIND_ALL_OUTLETS_BY_OUTLET_BRAND_NAME = "SELECT * FROM outlet WHERE brand_name=:brandName and location_id=:outletName ";
	 public static final String FIND_ALL_OUTLETS_BY_BRAND_NAME = "SELECT * FROM outlet WHERE brand_name=?1 ";
	 public static final String FIND_ALL_OUTLET_NAMES = "SELECT outlet_id, location_id FROM outlet";
	 public static final String FIND_ALL_OUTLET_NAMES_BY_BRAND = "SELECT outlet_id, location_id ,city_name, country FROM outlet a join address b on a.address_id = b.address_id where brand_id =:id ";
	 public static final String FIND_ALL_OUTLET_NAMES_BY_BRAND_COUNTRY = "SELECT outlet_id, location_id FROM outlet a join address b on a.address_id = b.address_id where brand_id =:id and country=:country and status in ('active','inactive')";
	 public static final String FIND_ALL_OUTLET_NAMES_BY_BRAND_CITY = "SELECT outlet_id, location_id FROM outlet a join address b on a.address_id = b.address_id where brand_id =:id and city_name=:city and status in ('active','inactive')";
	 public static final String FIND_DISTINCT_OUTLET_BY_MERCHANT = "SELECT distinct location_id FROM outlet where merchant_id=:id ";
	 public static final String FIND_OUTLETS_BY_MERCHANT_ID_BRAND_NAME = "SELECT * FROM outlet WHERE brand_name=:brandName and merchant_id=:merchantId and location_id=:outletName ";
	 public static final String FIND_OUTLETS_BY_BRAND_NAME = "SELECT * FROM outlet WHERE brand_name=:brandName and location_id=:outletName ";
	 public static final String FIND_DISTINCT_OUTLET = "SELECT distinct location_id FROM outlet where status in ('active','inactive')";
	 public static final String FIND_DISTINCT_OUTLET_BY_BRAND_ID = "SELECT outlet_id, location_id FROM outlet where brand_id=:brandId and status in ('active','inactive')";
	 public static final String UPDATE_OUTLET_STATUS = "update outlet set status ='closed' where outlet_id=:outletId ";
	 public static final String OUTLET_SUMMARY = "select c.outlet_id,location_id,city_name,offercount from "
	             + "(select outlet_id,location_id,city_name,a.address_id from outlet a join "
	             + "(select city_name,address_id from address) b where a.address_id = b.address_id) c "
	             + "JOIN (select aa.outlet_id, CASE WHEN ab.offercount IS NULL THEN 0 ELSE ab.offercount END as offercount from outlet aa "
				 + "LEFT JOIN "
				 + "(select b.outlet_id, count(b.outlet_id) as offercount from offer a join offer_redeem_outlets b where a.offer_id = b.offer_id and status =" + "'active' group by b.outlet_id) ab " 
				 + "on aa.outlet_id = ab.outlet_id where status in ('active','inactive') group by aa.outlet_id) d "
				 + "on c.outlet_id = d.outlet_id";
	 public static final String OUTLET_SUMMARY_BY_MERCHANT_ID = "select c.merchant_id,c.brand_name,c.outlet_id,location_id,city_name,offercount from "
			 +"(select merchant_id,brand_name,outlet_id,location_id,city_name,a.address_id from outlet a join "
			 +"(select city_name,address_id from address) b where a.address_id = b.address_id) c "
			 +"JOIN (select aa.outlet_id, CASE WHEN ab.offercount IS NULL THEN 0 ELSE ab.offercount END as offercount from outlet aa "
			 +"LEFT JOIN "
			 +"(select b.outlet_id, count(b.outlet_id) as offercount from offer a join offer_redeem_outlets b where a.offer_id = b.offer_id and status = " +"'active' group by b.outlet_id) ab "
			 +"on aa.outlet_id = ab.outlet_id where status in ('active','inactive') group by aa.outlet_id) d "
			 +"on c.outlet_id = d.outlet_id where merchant_id=?1 ";
	 public static final String OUTLET_SUMMARY_BY_BRAND_ID = "select c.outlet_id,location_id,city_name,offercount from "
			 + "(select outlet_id,location_id,city_name,a.address_id from outlet a "
			 + "JOIN (select city_name,address_id from address) b where brand_id =?1 and a.address_id = b.address_id) c  "
			 + "JOIN (select aa.outlet_id, CASE WHEN ab.offercount IS NULL THEN 0 ELSE ab.offercount END as offercount from outlet aa "
			 + "LEFT JOIN "
			 + "(select b.outlet_id, count(b.outlet_id) as offercount from offer a join offer_redeem_outlets b where a.offer_id = b.offer_id and status =" + "'active' group by b.outlet_id) ab " 
			 + "on aa.outlet_id = ab.outlet_id where status in ('active','inactive') group by aa.outlet_id) d "
			 + "on c.outlet_id = d.outlet_id";
	 public static final String OUTLET_SUMMARY_BY_BRAND_NAME = "select c.outlet_id,location_id,city_name,offercount from "
			 + "(select outlet_id,location_id,city_name,a.address_id from outlet a "
			 + "JOIN (select city_name,address_id from address) b where brand_name =?1 and a.address_id = b.address_id) c  "
			 + "JOIN (select aa.outlet_id, CASE WHEN ab.offercount IS NULL THEN 0 ELSE ab.offercount END as offercount from outlet aa "
			 + "LEFT JOIN "
			 + "(select b.outlet_id, count(b.outlet_id) as offercount from offer a join offer_redeem_outlets b where a.offer_id = b.offer_id and status =" + "'active' group by b.outlet_id) ab " 
			 + "on aa.outlet_id = ab.outlet_id where status in ('active','inactive') group by aa.outlet_id) d "
			 + "on c.outlet_id = d.outlet_id";
	 
    @Query(value = FIND_ALL_OUTLET_NAMES, nativeQuery = true)
    List<Object[]> findAllOutletNames();
    
    @Query(value = FIND_ALL_OUTLETS_BY_BRAND_NAME, nativeQuery = true)
    List<Outlet> findAllOutletsByBrandName(@Param("brandName") String brandName);
    
    @Query(value = FIND_OUTLETS_BY_NAME, nativeQuery = true)
    List<Object[]> findByName(@Param("name") String name);
    
    @Query(value = FIND_ALL_OUTLETS_BY_OUTLET_BRAND_NAME, nativeQuery = true)
    List<Outlet> findByOutletNameAndBrandName(@Param("brandName") String brandName,@Param("outletName") String outletName);
    
    @Query(value = FIND_ALL_OUTLET_NAMES_BY_BRAND, nativeQuery = true)
    List<Object[]> findByBrandId(@Param("id") Long id);
    
    @Query(value = OUTLET_SUMMARY, nativeQuery = true)
    List<Object[]> outletSummary();
    
    @Query(value = OUTLET_SUMMARY_BY_MERCHANT_ID, nativeQuery = true)
    List<Object[]> outletSummaryByMerchant(@Param("id") Long id);
    
    @Query(value = OUTLET_SUMMARY_BY_BRAND_ID, nativeQuery = true)
    List<Object[]> outletSummaryByBrandId(@Param("id") Long id);
    
    @Query(value = OUTLET_SUMMARY_BY_BRAND_NAME, nativeQuery = true)
    List<Object[]> outletSummaryByBrandName(@Param("name") String name);
    
    @Query(value = FIND_ALL_OUTLET_NAMES_BY_BRAND_COUNTRY, nativeQuery = true)
    List<Object[]> findByBrandIdAndCountry(@Param("id") Long id, @Param("country") String country);
    
    @Query(value = FIND_ALL_OUTLET_NAMES_BY_BRAND_CITY, nativeQuery = true)
    List<Object[]> findByBrandIdAndCity(@Param("id") Long id, @Param("city") String city);
    
    @Query(value = FIND_OUTLETS_BY_MERCHANT_ID_BRAND_NAME, nativeQuery = true)
    Outlet findByBrandIdAndMerchant(@Param("merchantId") Long merchantId, @Param("brandName") String brandName, @Param("outletName") String outletName);
    
    @Query(value = FIND_OUTLETS_BY_BRAND_NAME, nativeQuery = true)
    Outlet findOutletsByBrandName(@Param("brandName") String brandName, @Param("outletName") String outletName);
    
    @Query(value = FIND_DISTINCT_OUTLET_BY_MERCHANT,nativeQuery = true)
    List<Object> findDistinctByMerchantId(@Param("id") long id);
    
    @Query(value = FIND_DISTINCT_OUTLET,nativeQuery = true)
    List<Object> findDistinctOutlets();
    
    @Query(value = FIND_DISTINCT_OUTLET_BY_BRAND_ID,nativeQuery = true)
    List<Object[]> findDistinctOutletsByBrandId(@Param("brandId") long brandId);
    
    @Query(value = "select distinct city_name,country from outlet a join address b where a.address_id = b.address_id and merchant_id =?1 and brand_name=?2 and status in ('active','inactive');",nativeQuery = true)
    List<Object[]> findCityAndCountry(Long merchantId, String brandName);
    
    @Query(value = "select distinct country from outlet a join address b where a.address_id = b.address_id and merchant_id =?1 and brand_name=?2 and status in ('active','inactive');",nativeQuery = true)
    List<Object> findCountry(Long merchantId, String brandName);
    
    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_OUTLET_STATUS, nativeQuery = true)
	void updateOutletStatusToClosed(@Param("outletId") long outletId);
    
	@Query(value = "select a.offer_id from offer a join offer_redeem_outlets b where a.offer_id=b.offer_id and status in ('active','pending') and outlet_id=:outletId ;",nativeQuery = true)
    List<Object> findOfferIdForOutletId(@Param("outletId") long outletId);
	
	@Query(value = "select outlet_id from offer_redeem_outlets where offer_id =:offerId and outlet_id != :outletId ;",nativeQuery = true)
    List<Object> findOfferIdForOutletIdAndOfferId(@Param("offerId") long offerId,@Param("outletId") long outletId);
	
	@Modifying(clearAutomatically = true)
	@Query(value = "delete from offer_redeem_outlets where outlet_id=:outletId and offer_id =:offerId ;",nativeQuery = true)
    void deleteOutletForOffer(@Param("offerId") long offerId,@Param("outletId") long outletId);
}