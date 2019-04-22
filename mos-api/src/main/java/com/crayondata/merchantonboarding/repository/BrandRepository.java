package com.crayondata.merchantonboarding.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.crayondata.merchantonboarding.model.Brand;

@Transactional
public interface BrandRepository extends PagingAndSortingRepository<Brand, Long>{
	
	public static final String FIND_BY_NAME = "SELECT brand_id, name FROM brand WHERE name like %:name%";
	public static final String FIND_BRAND_BY_ID = "SELECT * FROM brand WHERE brand_id=:id ";
    public static final String FIND_BRANDS_LIKE_NAME = "SELECT * FROM brand WHERE name like %:name%";
    public static final String FIND_BRANDS_BY_NAME = "SELECT * FROM brand WHERE name=:brandName ";
    public static final String FIND_BRANDS_BY_NAME_MERCHANT_ID = "SELECT * FROM brand WHERE name=:name and merchant_id=:id and status in ('active','inactive')";
    public static final String FIND_ALL_BRAND_NAMES = "SELECT brand_id, name FROM brand";
    public static final String FIND_BRAND_BY_COUNTRY = "select distinct brand_id,name from (select a.brand_id,a.name,address_id from brand a join outlet b where a.brand_id = b.brand_id and a.status in ('active','inactive')) c join (select address_id,country from address where country =:country ) d where c.address_id = d.address_id";
    public static final String FIND_BRAND_BY_CITY = "select distinct brand_id,name from (select a.brand_id,a.name,address_id from brand a join outlet b where a.brand_id = b.brand_id and a.status in ('active','inactive')) c join (select address_id,city_name from address where city_name =:city ) d where c.address_id = d.address_id";
    public static final String FIND_BRAND_BY_MERCHANT = "SELECT brand_id as value,name as label FROM brand where merchant_id=:id and status in ('active','inactive')";
    public static final String FIND_DISTINCT_BRAND_BY_MERCHANT = "SELECT distinct name FROM brand where merchant_id=:id ";
    public static final String FIND_DISTINCT_BRAND = "SELECT distinct name FROM brand where status in ('active','inactive')";
    public static final String FIND_DISTINCT_CATEGORY = "select distinct category from brand;";
    public static final String FIND_CATEGORY_NAME = "select category_name from category where category_name = ?1 ;";
    public static final String FIND_SUB_CATEGORY = "select sub_category_name from sub_category where category_name = ?1 ;";
    public static final String FIND_USER_ACTIVITY = "select * from brand where modified_by=:userName ;";
    public static final String FIND_CLOSED_BRANDS = "select * from brand where status = 'closed' ;";
    public static final String FIND_ID_BY_CDF_BRAND_ID = "select brand_id from brand where cdf_brand_id = ?1 ;";
	
	public static final String BRAND_SUMMARY_BY_BRAND_ID = "SELECT g.brand_id,name,outlets,category,offers,CASE WHEN cities IS NULL THEN 0 ELSE cities END as cities from "
			+ "(select c.brand_id,name,outlets,category,CASE WHEN offers IS NULL THEN 0 ELSE offers END as offers from "
			+ "(select a.brand_id,name,CASE WHEN outlets IS NULL THEN 0 ELSE outlets END as outlets,category from brand a "
			+ "LEFT JOIN (select brand_id,count(brand_id) as outlets from outlet where status in ('active','inactive') group by brand_id) b on a.brand_id = b.brand_id and status in ('active','inactive')) c "
			+ "LEFT JOIN (SELECT brand_id,count(offer_id) as offers FROM offer WHERE status='active' group by brand_id) d on c.brand_id = d.brand_id) g "
			+ "LEFT JOIN (select brand_id,count(distinct city_name) as cities from address e join (select address_id, brand_id from outlet) f "
			+ "where e.address_id = f.address_id group by brand_id) h on g.brand_id = h.brand_id";
	
	
	/*public static final String BRAND_SUMMARY_BY_BRAND_NAME ="SELECT distinct g.brand_name,outlets,category,offers,CASE WHEN cities IS NULL THEN 0 ELSE cities END as cities from "
			+"(select c.brand_name,outlets,category,CASE WHEN offers IS NULL THEN 0 ELSE offers END as offers from "
			+"(select a.name as brand_name,CASE WHEN outlets IS NULL THEN 0 ELSE outlets END as outlets,category from brand a "
			+"LEFT JOIN (select brand_name,count(brand_name) as outlets from outlet where status in ('active','inactive') group by brand_name) b on a.name = b.brand_name and status in ('active','inactive')) c "
			+"LEFT JOIN (SELECT brand_name,count(offer_id) as offers FROM offer WHERE status='active' group by brand_name) d on c.brand_name = d.brand_name) g " 
			+"LEFT JOIN (select brand_name,count(distinct city_name) as cities from address e join (select address_id, brand_name from outlet) f "
			+"where e.address_id = f.address_id group by brand_name) h on g.brand_name = h.brand_name";*/
	
	public static final String BRAND_SUMMARY_BY_BRAND_NAME = "SELECT distinct g.brand_name,outlets,category,offers,CASE WHEN cities IS NULL THEN 0 ELSE cities END as cities,country from "
			+"(select c.brand_name,outlets,category,CASE WHEN offers IS NULL THEN 0 ELSE offers END as offers from "
			+"(select a.name as brand_name,CASE WHEN outlets IS NULL THEN 0 ELSE outlets END as outlets,category from brand a "
			+"LEFT JOIN (select brand_name,count(brand_name) as outlets from outlet where status in ('active','inactive') group by brand_name) b on a.name " 
			+"= b.brand_name and status in ('active','inactive')) c "
			+"LEFT JOIN (SELECT brand_name,count(offer_id) as offers FROM offer WHERE status='active' group by brand_name) d on c.brand_name = " +"d.brand_name) g "
			+"LEFT JOIN (select brand_name,count(distinct city_name) as cities,country from address e join (select address_id, brand_name from outlet) f "
			+"where e.address_id = f.address_id group by brand_name,country) h on g.brand_name = h.brand_name";
	
	/*public static final String BRAND_SUMMARY_BY_BRAND_ID_MERCHANT_ID = "SELECT g.brand_id,name,outlets,category,offers,CASE WHEN cities IS NULL THEN 0 ELSE cities END as cities,CASE WHEN tag = '' or tag is null THEN 0 ELSE 1 END as tagsBoolean from " 
			+ "(select c.brand_id,name,outlets,category,CASE WHEN offers IS NULL THEN 0 ELSE offers END as offers,tag from "
			+ "(select a.brand_id,name,CASE WHEN outlets IS NULL THEN 0 ELSE outlets END as outlets,category,tag from brand a "
			+ "LEFT JOIN (select brand_id,count(brand_id) as outlets from outlet where status in ('active','inactive') group by brand_id) b on a.brand_id = b.brand_id where merchant_id=?1 and status in ('active','inactive')) c "
			+ "LEFT JOIN (SELECT brand_id,count(offer_id) as offers FROM offer WHERE status='active' group by brand_id) d on c.brand_id = d.brand_id) g "
			+ "LEFT JOIN (select brand_id,count(distinct city_name) as cities from address e join (select address_id, brand_id from outlet) f " 
			+ "where  e.address_id = f.address_id group by brand_id) h on g.brand_id = h.brand_id";*/
	
	public static final String BRAND_SUMMARY_BY_BRAND_ID_MERCHANT_ID = "select c.brand_id,name,CASE WHEN cities IS NULL THEN 0 ELSE cities END as cities,outlets,category,CASE WHEN tag = '' or tag is null THEN 0 " +"ELSE 1 END as tagsBoolean,status,curateFlag from "
	        + "(select a.brand_id,name,CASE WHEN outlets IS NULL THEN 0 ELSE outlets END as outlets,category,tag,status,unable_to_curate as curateFlag from brand a "
	        + "LEFT JOIN (select brand_id,count(brand_id) as outlets from outlet group by brand_id) b on a.brand_id = b.brand_id where merchant_id=:id ) c "
	        + "LEFT JOIN (select brand_id,count(distinct city_name) as cities from address d join (select address_id, brand_id from outlet) e "
	        + "where  d.address_id = e.address_id group by brand_id) f on c.brand_id = f.brand_id;";
	
	public static final String BRAND_SUMMARY_BY_BRAND_NAME_MERCHANT_ID ="SELECT distinct g.brand_name,outlets,category,offers,CASE WHEN cities IS NULL THEN 0 ELSE cities END as cities from "
			+"(select c.brand_name,outlets,category,CASE WHEN offers IS NULL THEN 0 ELSE offers END as offers from "
			+"(select a.name as brand_name,CASE WHEN outlets IS NULL THEN 0 ELSE outlets END as outlets,category from brand a "
			+"LEFT JOIN (select brand_name,count(brand_name) as outlets from outlet where status in ('active','inactive') group by brand_name) b on a.name = b.brand_name where merchant_id=?1 and status in ('active','inactive')) c "
			+"LEFT JOIN (SELECT brand_name,count(offer_id) as offers FROM offer WHERE status='active' group by brand_name) d on c.brand_name = d.brand_name) g " 
			+"LEFT JOIN (select brand_name,count(distinct city_name) as cities from address e join (select address_id, brand_name from outlet) f "
			+"where e.address_id = f.address_id group by brand_name) h on g.brand_name = h.brand_name";
	
	Page<Brand> findByCategory(String categoryName,Pageable pageable);
	
	@Query(value = "select a.outlets from (select brand_id,count(outlet_id) as outlets from outlet where brand_id =?1 and status != 'closed' group by brand_id) a;",nativeQuery = true)
	Object findOutletCountByBrand(long brandId);
	
	@Query(value = "select a.outlets from (select brand_name,count(outlet_id) as outlets from outlet where brand_name =?1 and status != 'closed' group by brand_name) a;",nativeQuery = true)
	Object findOutletCountByBrandName(String brandName);
	
	@Query(value = "select a.offers from (select brand_id,count(offer_id) as offers from offer where status='active' and brand_id =?1 group by brand_id) a;",nativeQuery = true)
	Object findActiveOffersByBrand(long brandId);
	
	/*@Query(value = "select a.offers from (select brand_name,count(offer_id) as offers from offer where status='active' and brand_name =?1 group by brand_name) a;",nativeQuery = true)
	Object findActiveOffersByBrandName(String brandName);*/
	
	@Query(value = "select a.offers from (select brand_name,count(offer_id) as offers from offer where status='active' and brand_id in (select brand_id from brand where name=:brandName ) group by brand_name) a;",nativeQuery = true)
	Object findActiveOffersByBrandName(@Param("brandName") String brandName);
	
	@Query(value = "select a.offers from (select brand_id,count(offer_id) as offers from offer where status='pending' and brand_id =?1 group by brand_id) a;",nativeQuery = true)
	Object findPendingOffersByBrand(long brandId);
	
	@Query(value = "select a.offers from (select brand_name,count(offer_id) as offers from offer where status='pending' and brand_id in (select brand_id from brand where name=:brandName ) group by brand_name) a;",nativeQuery = true)
	Object findPendingOffersByBrandName(@Param("brandName") String brandName);
	
	/*@Query(value = "select g.brand_id,name,outlets,category,offers,cities from (select c.brand_id,name,outlets,category,offers from (select a.brand_id,name,outlets,category from brand a join (select brand_id,count(brand_id) as outlets from outlet group by brand_id) b where a.brand_id = b.brand_id) c join (SELECT brand_id,count(offer_id) as offers FROM offer WHERE status='active' group by brand_id) d where c.brand_id = d.brand_id) g JOIN (select brand_id,count(distinct city) as cities from address e join  (select address_id, brand_id from outlet) f   where e.address_id = f.address_id group by brand_id) h where g.brand_id = h.brand_id;",nativeQuery = true)
	List<Object[]> brandSummary();
	
	@Query(value = "select g.brand_id,name,outlets,category,offers,cities from (select c.brand_id,name,outlets,category,offers from (select a.brand_id,name,outlets,category from brand a join (select brand_id,count(brand_id) as outlets from outlet group by brand_id) b where merchant_id = :id and a.brand_id = b.brand_id) c join (SELECT brand_id,count(offer_id) as offers FROM offer WHERE status='active' group by brand_id) d where c.brand_id = d.brand_id) g JOIN (select brand_id,count(distinct city) as cities from address e join  (select address_id, brand_id from outlet) f   where e.address_id = f.address_id group by brand_id) h where g.brand_id = h.brand_id;",nativeQuery = true)
    List<Object[]> brandSummaryByMerchant(@Param("id") Long id);*/
	
	@Query(value = BRAND_SUMMARY_BY_BRAND_ID, nativeQuery = true)
	List<Object[]> brandSummary();
	
	@Query(value = BRAND_SUMMARY_BY_BRAND_NAME, nativeQuery = true)
	List<Object[]> brandSummaryByBrandName();
	
	@Query(value = BRAND_SUMMARY_BY_BRAND_ID_MERCHANT_ID, nativeQuery = true)
	List<Object[]> brandSummaryByMerchant(@Param("id") Long id);
	
	@Query(value = BRAND_SUMMARY_BY_BRAND_NAME_MERCHANT_ID, nativeQuery = true)
	List<Object[]> brandSummaryByNameMerchant(@Param("id") long id);
	
	@Query(value = "select distinct city_name,country from outlet a join address b where a.address_id = b.address_id and brand_id =?1 ;",nativeQuery = true)
	List<Object[]> findCityAndCountryByBrand(long brandId);
	
	@Query(value = "select distinct city_name,country from outlet a join address b where a.address_id = b.address_id and brand_name =?1 ;",nativeQuery = true)
	List<Object[]> findCityAndCountryByBrandName(String brandName);
	
	@Query(value = "select distinct city_name,country from outlet a join address b where a.address_id = b.address_id and status in ('active','inactive');",nativeQuery = true)
    List<Object[]> findCityAndCountry();
    
    @Query(value = "select distinct city_name,country from outlet a join address b where a.address_id = b.address_id and brand_id=:id ;",nativeQuery = true)
    List<Object[]> findCityAndCountryById(@Param("id") long id);
    
    @Query(value = "select distinct country from outlet a join address b where a.address_id = b.address_id and status in ('active','inactive');",nativeQuery = true)
    List<Object> findCountry();
    
    @Query(value = "select distinct country from outlet a join address b where a.address_id = b.address_id and brand_id=:id ;",nativeQuery = true)
    List<Object> findCountryById(@Param("id") long id);
   
    @Query(value = "select distinct country from outlet a join address b where a.address_id = b.address_id;",nativeQuery = true)
    List<String> findExistingCountry();
    
    @Query(value = "select distinct country from country",nativeQuery = true)
    List<String> findAllCountry();
    
    @Query(value = "select distinct city_name from outlet a join address b where a.address_id = b.address_id and country =:country ;",nativeQuery = true)
    List<String> findExistingCity(@Param("country") String country);
    
    @Query(value = "select distinct city_name from country where country =:country ;",nativeQuery = true)
    List<String> findAllCity(@Param("country") String country);
    
    @Query(value = "select max(brand_id) from brand;",nativeQuery = true)
    Object findLastId();
	
    @Query(value = FIND_BRAND_BY_ID, nativeQuery = true)
    Brand findByBrandId(@Param("id") Long id);
	
    @Query(value = FIND_ALL_BRAND_NAMES, nativeQuery = true)
    List<Object[]> findAllBrandNames();
    
    @Query(value = FIND_BRANDS_LIKE_NAME, nativeQuery = true)
    List<Brand> findBrandsLikeName(@Param("name") String name);
    
    @Query(value = FIND_BY_NAME, nativeQuery = true)
    List<Object[]> findByName(@Param("name") String name);
    
    @Query(value = FIND_BRANDS_BY_NAME, nativeQuery = true)
    List<Brand> findBrandsByName(@Param("brandName") String brandName);
    
    @Query(value = FIND_BRANDS_BY_NAME_MERCHANT_ID, nativeQuery = true)
    Brand findBrandsByNameAndMerchant(@Param("name") String name,@Param("id") long id);
    
    @Query(value = FIND_BRAND_BY_COUNTRY,nativeQuery = true)
    List<Object[]> findBrandByCountry(@Param("country") String country);    
    
    @Query(value = FIND_BRAND_BY_CITY,nativeQuery = true)
    List<Object[]> findBrandByCity(@Param("city") String city);
    
    @Query(value = FIND_BRAND_BY_MERCHANT,nativeQuery = true)
    List<Object[]> findByMerchantId(@Param("id") long id);
    
    @Query(value = FIND_DISTINCT_BRAND_BY_MERCHANT,nativeQuery = true)
    List<Object> findDistinctByMerchantId(@Param("id") long id);
    
    @Query(value = FIND_DISTINCT_BRAND,nativeQuery = true)
    List<Object> findDistinctBrand();
    
    @Query(value = FIND_DISTINCT_CATEGORY,nativeQuery = true)
    List<Object> findDistinctCategory();
    
    @Query(value = FIND_CATEGORY_NAME, nativeQuery = true)
    String findCategoryName(String name);

    @Query(value = FIND_SUB_CATEGORY, nativeQuery = true)
    List<String> findSubCategory(String category);

    @Query(value = FIND_USER_ACTIVITY, nativeQuery = true)
    List<Brand> findUserActivity(@Param("userName") String userName);

    @Query(value = FIND_CLOSED_BRANDS, nativeQuery = true)
    List<Brand> findClosedBrands();

    @Query(value = FIND_ID_BY_CDF_BRAND_ID, nativeQuery = true)
    Long findIdByCdfBrandId(String brandId);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "update outlet set status=:status where brand_id=:brandId ;",nativeQuery = true)
    void updateOutletStatusForBrand(@Param("status") String status,@Param("brandId") long brandId);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "update outlet set status=:status where brand_name=:brandName ;",nativeQuery = true)
    void updateOutletStatusForBrandName(@Param("status") String status,@Param("brandName") String brandName);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "update offer set status=:status where brand_id=:brandId and status in ('active','pending');",nativeQuery = true)
    void updateOfferStatusForBrand(@Param("status") String status,@Param("brandId") long brandId);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "update offer set status=:status where brand_name=:brandName and status in ('active','pending');",nativeQuery = true)
    void updateOfferStatusForBrandName(@Param("status") String status, @Param("brandName") String brandName);
}