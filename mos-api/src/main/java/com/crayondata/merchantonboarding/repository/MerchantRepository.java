package com.crayondata.merchantonboarding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.crayondata.merchantonboarding.model.Merchant;

@Transactional
public interface MerchantRepository extends PagingAndSortingRepository<Merchant, Long>{
    
    public static final String FIND_BY_NAME = "SELECT merchant_id, name FROM merchant WHERE name like %:name%";
    public static final String FIND_MERCHANTS_BY_NAME = "SELECT * FROM merchant WHERE name=:name ";
    public static final String FIND_ALL_MERCHANT_NAMES = "SELECT merchant_id, name FROM merchant";
    public static final String FIND_MERCHANTS_BY_BRAND_NAME = "SELECT * FROM merchant where merchant_id in (SELECT merchant_id from brand where name like %:name%)";
    public static final String FIND_MERCHANTS_BY_BRAND_ID = "SELECT * FROM merchant where merchant_id in (SELECT merchant_id from brand where brand_id = :id)";
    public static final String FIND_MERCHANT_COUNTRY_CITY = "select distinct city_name,country from merchant a join address b where a.address_id = b.address_id and status in ('active','inactive')";
    public static final String FIND_MERCHANT_COUNTRY = "select distinct country from merchant a join address b where a.address_id = b.address_id and status in ('active','inactive')";
    public static final String FIND_MERCHANT_COUNTRY_CITY_BY_USER = "select distinct city_name,country from user_merchant a join (select city_name,country,merchant_id from merchant a join address b where a.address_id = b.address_id and status in ('active','inactive')) b on a.merchantid = b.merchant_id where userid=:userId ;";
    public static final String FIND_MERCHANT_COUNTRY_BY_USER = "select distinct country from user_merchant a join (select country,merchant_id from merchant a join address b where a.address_id = b.address_id and status in ('active','inactive')) b on a.merchantid = b.merchant_id where userid=:userId ;";
    public static final String FIND_MERCHANT_BY_COUNTRY = "select distinct merchant_id, name from merchant a join (select country, address_id from address) b where a.address_id = b.address_id and country =:country and status in ('active','inactive') ";
    public static final String FIND_MERCHANT_BY_CITY = "select distinct merchant_id, name, city_name from merchant a join (select city_name, address_id from address) b where a.address_id = b.address_id and city_name =:city and status in ('active','inactive')";
    public static final String FIND_MERCHANT_BY_COUNTRY_AND_USER = "select distinct merchant_id, name from user_merchant a join (select distinct merchant_id, name from merchant a join (select country, address_id from address) b where a.address_id = b.address_id and country =:country and status in ('active','inactive')) b on a.merchantid=b.merchant_id where a.userid=:userId ;";
    public static final String FIND_MERCHANT_BY_CITY_AND_USER = "select distinct merchant_id, name from user_merchant a join (select distinct merchant_id, name, city_name from merchant a join (select city_name, address_id from address) b where a.address_id = b.address_id and city_name =:city and status in ('active','inactive')) b on a.merchantid=b.merchant_id where a.userid=:userId ;";
    public static final String FIND_ID_BY_CDF_MERCHANT_ID = "select merchant_id from merchant where cdf_merchant_id = ?1 ";
    
	Merchant findByEmail(@Param("email") String email);

    Merchant findByMerchantId(@Param("id") Long id);
     
    @Query(value = FIND_ALL_MERCHANT_NAMES, nativeQuery = true)
    List<Object[]> findAllMerchantNames();
    
    @Query(value = FIND_BY_NAME, nativeQuery = true)
    List<Object[]> findByName(@Param("name") String name);
    
    @Query(value = FIND_MERCHANTS_BY_NAME, nativeQuery = true)
    List<Merchant> findMerchantByName(@Param("name") String name);
    
    @Query(value = FIND_MERCHANTS_BY_BRAND_NAME, nativeQuery = true)
    List<Merchant> findByBrandName(@Param("name") String name);
    
    @Query(value = FIND_MERCHANTS_BY_BRAND_ID, nativeQuery = true)
    Merchant findByBrandId(@Param("id") Long id);
    
    @Query(value = FIND_MERCHANT_COUNTRY_CITY,nativeQuery = true)
    List<Object[]> findCityAndCountry();
    
    @Query(value = FIND_MERCHANT_COUNTRY,nativeQuery = true)
    List<Object> findCountry();
    
    @Query(value = FIND_MERCHANT_COUNTRY_CITY_BY_USER,nativeQuery = true)
    List<Object[]> findCityAndCountry(@Param("userId") Long userId);
    
    @Query(value = FIND_MERCHANT_COUNTRY_BY_USER,nativeQuery = true)
    List<Object> findCountry(@Param("userId") Long userId);
    
    @Query(value = FIND_MERCHANT_BY_COUNTRY,nativeQuery = true)
    List<Object[]> findMerchantByCountry(@Param("country") String country);    
    
    @Query(value = FIND_MERCHANT_BY_CITY,nativeQuery = true)
    List<Object[]> findMerchantByCity(@Param("city") String city);
    
    @Query(value = FIND_MERCHANT_BY_COUNTRY_AND_USER,nativeQuery = true)
    List<Object[]> findMerchantByCountry(@Param("country") String country, @Param("userId") Long userId);    
    
    @Query(value = FIND_MERCHANT_BY_CITY_AND_USER,nativeQuery = true)
    List<Object[]> findMerchantByCity(@Param("city") String city, @Param("userId") Long userId);
    
    @Query(value = FIND_ID_BY_CDF_MERCHANT_ID,nativeQuery = true)
    Long findIdByCdfMerchantId(String cdfMerchantId);
    
    @Query(value = "select distinct country from merchant a join address b where a.address_id = b.address_id",nativeQuery = true)
    List<String> findExistingCountry();
    
    @Query(value = "select distinct country from country",nativeQuery = true)
    List<String> findAllCountry();
    
    @Query(value = "select distinct city_name from merchant a join address b where a.address_id = b.address_id and country =:country ;",nativeQuery = true)
    List<String> findExistingCity(@Param("country") String country);
    
    @Query(value = "select distinct city_name from country where country =:country ;",nativeQuery = true)
    List<String> findAllCity(@Param("country") String country);
    
    @Query(value = "select merchant_id,name from merchant;",nativeQuery = true)
    List<Object[]> findDistinctMerchant();
    
    @Modifying(clearAutomatically = true)
    @Query(value = "update brand set status=:status where merchant_id=:merchantId ;",nativeQuery = true)
    void updateBrandStatusForMerchant(@Param("status") String status,@Param("merchantId") long merchantId);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "update outlet set status=:status where merchant_id=:merchantId ;",nativeQuery = true)
    void updateOutletStatusForMerchant(@Param("status") String status,@Param("merchantId") long merchantId);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "update offer set status=:status where merchant_id=:merchantId and status in ('active','pending');",nativeQuery = true)
    void updateOfferStatusForMerchant(@Param("status") String status, @Param("merchantId") long merchantId);
    
}