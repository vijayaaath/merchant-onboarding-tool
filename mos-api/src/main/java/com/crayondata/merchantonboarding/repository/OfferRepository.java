package com.crayondata.merchantonboarding.repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.crayondata.merchantonboarding.model.Offer;
@Transactional
public interface OfferRepository extends PagingAndSortingRepository<Offer, Long>{
    
    public static final String FIND_OFFERS_BY_NAME = "SELECT offer_id, short_desc FROM offer WHERE short_desc like %:name%";
    public static final String FIND_ALL_OFFER_NAMES = "SELECT offer_id, short_desc FROM offer";
    public static final String UPDATE_OFFER_STATUS = "update offer set status =:status where offer_id=:offerId ";
    public static final String UPDATE_OUTLET_STATUS = "update outlet set status =:status where outlet_id=:outletId ";
    public static final String UPDATE_OUTLET_STATUS_BY_BRAND_OUTLET_NAME = "update outlet set status =:status where brand_name=:brandName and location_id=:outletName ";
    public static final String UPDATE_BRAND_STATUS = "update brand set status =:status where brand_id=:brandId ";
    public static final String UPDATE_BRAND_STATUS_BY_NAME = "update brand set status =:status where name=:brandName ";
    public static final String UPDATE_MERCHANT_STATUS = "update merchant set status =:status where merchant_id=:merchantId ";
    public static final String TRUNCATE_OFFER_REDEEM_OUTLETS = "truncate offer_redeem_outlets;";
    public static final String INSERT_OFFER_REDEEM_OUTLETS = "insert into offer_redeem_outlets "
            + "select a.offer_id,b.outlet_id from offer a join (select brand_id,outlet_id from outlet) b on a.brand_id=b.brand_id;";
    
    public static final String UPDATE_OFFER_STATUS_ACTIVE = "update offer set status = 'active' where valid_from < now() and valid_to > now() ;";
    public static final String UPDATE_OFFER_STATUS_PENDING = "update offer set status = 'pending' where valid_from > now() ;";
    public static final String UPDATE_OFFER_STATUS_EXPIRED = "update offer set status = 'expired' where valid_to < now() ;";
    public static final String UPDATE_OUTLET_STATUS_ACTIVE = "update outlet set status='active' where outlet_id in (select outlet_id from offer a join offer_redeem_outlets b on a.offer_id=b.offer_id where status='active') ;";
    public static final String UPDATE_OUTLET_STATUS_INACTIVE= "update outlet set status='inactive' where status!='active' ;";
    public static final String UPDATE_BRAND_STATUS_ACTIVE =  "update brand set status='active' where brand_id in (select brand_id from outlet where status='active') ;";
    public static final String UPDATE_BRAND_STATUS_INACTIVE = "update brand set status='inactive' where status!='active' ;";
    public static final String UPDATE_MERCHANT_STATUS_ACTIVE = "update merchant set status='active' where merchant_id in (select merchant_id from brand where status='active') ;";
    public static final String UPDATE_MERCHANT_STATUS_INACTIVE = "update merchant set status='inactive' where status!='active' ;";
    
    
    /*public static final String OFFER_SUMMARY = "select e.merchant_id,e.brand_id,e.name,f.outlet_id,f.location_id,f.offer_id,f.med_desc,f.status,f.outlets,f.valid_from,f.valid_to from brand e " 
    		+ "JOIN (select c.brand_id,c.outlet_id,c.location_id,d.offer_id,d.med_desc,d.status,d.outlets,d.valid_from,d.valid_to from outlet c "
    		+ "JOIN (select a.offer_id,med_desc,status,outlets,valid_from,valid_to,outlet_id from offer a "
    		+ "LEFT JOIN (select offer_id,outlet_id,count(outlet_id) as outlets from offer_redeem_outlets group by offer_id) b "
    		+ "on a.offer_id = b.offer_id) d "
    		+ "on c.outlet_id = d.outlet_id) f "
    		+ "on e.brand_id = f.brand_id where f.status !='cancelled' ";*/
    
    public static final String OFFER_SUMMARY = "select e.merchant_id,e.brand_id,e.tenant_name,e.name,e.category,f.outlet_id,f.location_id,f.offer_id,f.short_desc,f.status,f.outlets,f.valid_from,f.valid_to from brand e " 
    		+"JOIN (select c.brand_id,c.outlet_id,c.location_id,d.offer_id,d.short_desc,d.status,d.outlets,d.valid_from,d.valid_to from outlet c " 
    		+"JOIN (select a.offer_id,short_desc,status,outlets,valid_from,valid_to,outlet_id from offer a " 
    		+"LEFT JOIN (select offer_id,outlet_id,count(outlet_id) as outlets from offer_redeem_outlets group by offer_id) b " 
    		+"on a.offer_id = b.offer_id) d  "
    		+"on c.outlet_id = d.outlet_id) f " 
    		+"on e.brand_id = f.brand_id where f.status !='cancelled'";
    public static final String OFFER_SUMMARY_BY_MERCHANT_ID ="select e.merchant_id,e.brand_id,e.name,f.outlet_id,f.location_id,f.offer_id,f.short_desc,f.status,f.outlets,f.valid_from,f.valid_to from brand e "
    		+"JOIN (select c.brand_id,c.outlet_id,c.location_id,d.offer_id,d.short_desc,d.status,d.outlets,d.valid_from,d.valid_to from outlet c "  
    		+"JOIN (select a.offer_id,short_desc,status,outlets,valid_from,valid_to,outlet_id from offer a "
    		+"LEFT JOIN (select offer_id,outlet_id,count(outlet_id) as outlets from offer_redeem_outlets group by offer_id) b " 
    		+"on a.offer_id = b.offer_id) d " 
    		+"on c.outlet_id = d.outlet_id) f "
    		+"on e.brand_id = f.brand_id where e.merchant_id=?1 and f.status !='cancelled' ";;
    public static final String OFFER_SUMMARY_BY_BRAND_ID = "select e.merchant_id,e.brand_id,e.name,f.outlet_id,f.location_id,f.offer_id,f.short_desc,f.status,f.outlets,f.valid_from,f.valid_to from brand e " 
    		+ "JOIN (select c.brand_id,c.outlet_id,c.location_id,d.offer_id,d.short_desc,d.status,d.outlets,d.valid_from,d.valid_to from outlet c "
    		+ "JOIN (select a.offer_id,short_desc,status,outlets,valid_from,valid_to,outlet_id from offer a "
    		+ "LEFT JOIN (select offer_id,outlet_id,count(outlet_id) as outlets from offer_redeem_outlets group by offer_id) b "
    		+ "on a.offer_id = b.offer_id) d "
    		+ "on c.outlet_id = d.outlet_id) f "
    		+ "on e.brand_id = f.brand_id where e.brand_id=?1 and f.status !='cancelled' ";
    
    public static final String OFFER_SUMMARY_BY_BRAND_NAME = "select e.merchant_id,e.brand_id,e.name,f.outlet_id,f.location_id,f.offer_id,f.short_desc,f.status,f.outlets,f.valid_from,f.valid_to from brand e " 
    		+ "JOIN (select c.brand_id,c.outlet_id,c.location_id,d.offer_id,d.short_desc,d.status,d.outlets,d.valid_from,d.valid_to from outlet c "
    		+ "JOIN (select a.offer_id,short_desc,status,outlets,valid_from,valid_to,outlet_id from offer a "
    		+ "LEFT JOIN (select offer_id,outlet_id,count(outlet_id) as outlets from offer_redeem_outlets group by offer_id) b "
    		+ "on a.offer_id = b.offer_id) d "
    		+ "on c.outlet_id = d.outlet_id) f "
    		+ "on e.brand_id = f.brand_id where e.name=?1 and f.status !='cancelled' ";
    
	@Query(value = "SELECT count(*) FROM merchant",nativeQuery = true)
	Object findMerchantEntities();
	
	@Query(value = "SELECT merchant_id FROM offer WHERE status in ('active','pending') and merchant_id=?1 ",nativeQuery = true)
	Object findIfMerchantIsActive(long merchantId);
	
	@Query(value = "SELECT merchant_id FROM offer WHERE status not in ('active','pending') and merchant_id=?1 ",nativeQuery = true)
	Object findIfMerchantIsInactive(long merchantId);
	
	@Query(value = "SELECT count(*) FROM brand",nativeQuery = true)
	Object findBrandEntities();
	
	@Query(value = "SELECT brand_id FROM offer WHERE status in ('active','pending') and brand_id=?1 ",nativeQuery = true)
	Object findIfBrandIsActive(long brandId);
	
	@Query(value = "SELECT brand_id FROM offer WHERE status not in ('active','pending') and brand_id=?1 ",nativeQuery = true)
	Object findIfBrandIsInactive(long brandId);
	
	@Query(value = "select count(*) from outlet",nativeQuery = true)
	Object findOutletEntities();
	
	@Query(value = "select outlet_id from offer a join offer_redeem_outlets b where a.offer_id=b.offer_id and status in ('active','pending') and outlet_id=?1 ",nativeQuery = true)
	Object findIfOutletIsActive(long outletId);
	
	@Query(value = "select outlet_id from offer a join offer_redeem_outlets b where a.offer_id=b.offer_id and status not in ('active','pending') and outlet_id=?1 ",nativeQuery = true)
	Object findIfOutletIsInactive(long outletId);
	
	@Query(value = "SELECT count(distinct offer_id) FROM offer WHERE status='active'",nativeQuery = true)
	Object findActiveOfferEntitiesCount();
	
	@Query(value = "SELECT * FROM offer WHERE status='active'",nativeQuery = true)
	List<Offer> findActiveOfferEntities();
	
	@Query(value = "SELECT * FROM offer WHERE status='active' \n#pageable\n ",countQuery="SELECT count(*) FROM offer WHERE status='active' ",nativeQuery = true)
	Page<Offer> findActiveOfferEntitiesPaged(Pageable pageable);
	
	@Query(value = "SELECT count(offer_id) FROM offer WHERE ?1 < valid_from and status != 'cancelled'",nativeQuery = true)
	Object findPendingOffersCount(Timestamp timeStamp);
	
	@Query(value = "SELECT * FROM offer WHERE ?1 < valid_from and status != 'cancelled'",nativeQuery = true)
	List<Offer> findPendingOffers(Timestamp timeStamp);
	
	@Query(value = "SELECT * FROM offer WHERE ?1 < valid_from and status != 'cancelled' \n#pageable\n ",countQuery="SELECT count(*) FROM offer WHERE ?1 < valid_from and status != 'cancelled'",nativeQuery = true)
	Page<Offer> findPendingOffersPaged(Timestamp timeStamp, Pageable pageable);

	@Query(value = "SELECT count(offer_id) FROM offer WHERE status='active' and valid_to <=?1",nativeQuery = true)
	Object findExpiringOffersCount(Timestamp timeStamp);
	
	@Query(value = "SELECT * FROM offer WHERE status='active' and valid_to <=?1",nativeQuery = true)
	List<Offer> findExpiringOffers(Timestamp timeStamp);
	
	@Query(value = "SELECT * FROM offer WHERE status='active' and valid_to <=?1 \n#pageable\n ",countQuery="SELECT count(*) FROM offer WHERE status='active' and valid_to <=?1",nativeQuery = true)
	Page<Offer> findExpiringOffersPaged(Timestamp timeStamp, Pageable pageable);
	
	@Query(value = "select category,count(category) from brand o inner join offer b where o.brand_id=b.brand_id and b.status='active' group by category",nativeQuery = true)
	List<Object[]> findCategoryDistributionByOffers();
	
	@Query(value = "select category,count(category) from brand group by category",nativeQuery = true)
	List<Object[]> findCategoryDistributionByBrands();
	
	@Query(value = "select count(*) from offer where valid_from <=?2 and valid_to >=?1 and status != 'cancelled'",nativeQuery = true)
	Object findActiveOffersOverTime(Timestamp fromTime,Timestamp toTime);
	
	@Query(value = "select max(offer_id) from offer;",nativeQuery = true)
    Object findLastId();
	
	@Query(value = "select * from offer where offer_id =:id ;",nativeQuery = true)
	Offer findByOfferId(@Param("id") Long id);
	
	@Query(value = "select * from offer where status !='cancelled';",nativeQuery = true)
	List<Offer> findAll();
	
	@Query(value = "select a.* from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status !='cancelled';",nativeQuery = true)
	List<Offer> findByUser(@Param("userId") Long userId);
	
	@Query(value = "select a.* from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status !='cancelled' \n#pageable\n ",countQuery = "select count(a.*) from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status !='cancelled'",nativeQuery = true)
	Page<Offer> findByUserPaged(@Param("userId") Long userId, Pageable pageable);
	
	@Query(value = "select a.* from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status ='active';",nativeQuery = true)
	List<Offer> findActiveOfferByUser(@Param("userId") Long userId);
	
	@Query(value = "select a.* from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status ='active' \n#pageable\n ",countQuery="select count(a.*) from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status ='active'",nativeQuery = true)
	Page<Offer> findActiveOfferByUserPaged(@Param("userId") Long userId, Pageable pageable);
	
	@Query(value = "select a.* from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status ='pending' and :timeStamp < valid_from;",nativeQuery = true)
	List<Offer> findPendingOfferByUser(@Param("userId") Long userId, @Param("timeStamp") Timestamp timeStamp);
	
	@Query(value = "select a.* from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status ='pending' and :timeStamp < valid_from \n#pageable\n ",countQuery="select count(a.*) from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status ='pending' and :timeStamp < valid_from",nativeQuery = true)
	Page<Offer> findPendingOfferByUserPaged(@Param("userId") Long userId, @Param("timeStamp") Timestamp timeStamp, Pageable pageable);
	
	@Query(value = "select a.* from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status ='active' and valid_to <=:timeStamp ;",nativeQuery = true)
	List<Offer> findExpiringOfferByUser(@Param("userId") Long userId,@Param("timeStamp") Timestamp timeStamp);
	
	@Query(value = "select a.* from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status ='active' and valid_to <=:timeStamp \n#pageable\n ",countQuery="select count(a.*) from offer a join user_merchant b on a.merchant_id=b.merchantid where b.userid=:userId and status ='active' and valid_to <=:timeStamp",nativeQuery = true)
	Page<Offer> findExpiringOfferByUserPaged(@Param("userId") Long userId,@Param("timeStamp") Timestamp timeStamp, Pageable pageable);
	
	@Query(value = "select * from offer where status =?1 ;",nativeQuery = true)
	List<Offer> findOfferByStatus(String status);
	
    @Query(value = FIND_ALL_OFFER_NAMES, nativeQuery = true)
    List<Object[]> findAllOfferNames();
    
    @Query(value = FIND_OFFERS_BY_NAME, nativeQuery = true)
    List<Object[]> findByName(@Param("name") String name);
    
    @Query(value = OFFER_SUMMARY, nativeQuery = true)
	List<Object[]> offerSummary();
	
	@Query(value = OFFER_SUMMARY_BY_MERCHANT_ID, nativeQuery = true)
	List<Object[]> offerSummaryByMerchant(@Param("id") Long id);
	
	@Query(value = OFFER_SUMMARY_BY_BRAND_ID, nativeQuery = true)
	List<Object[]> offerSummary(long id);
	
	@Query(value = OFFER_SUMMARY_BY_BRAND_NAME, nativeQuery = true)
	List<Object[]> offerSummaryByBrandName(String name);
	
	@Modifying(clearAutomatically = true)
	@Query(value = UPDATE_OFFER_STATUS, nativeQuery = true)
	void updateOfferStatus(@Param("status") String status,@Param("offerId") long offerId);
	
	@Modifying(clearAutomatically = true)
	@Query(value = UPDATE_OUTLET_STATUS, nativeQuery = true)
	void updateOutletStatus(@Param("status") String status,@Param("outletId") long outletId);

	@Modifying(clearAutomatically = true)
	@Query(value = UPDATE_OUTLET_STATUS_BY_BRAND_OUTLET_NAME, nativeQuery = true)
	void updateOutletStatusByBrandOutletName(@Param("status") String status,@Param("brandName") String brandName, @Param("outletName") String outletName);
	
	@Modifying(clearAutomatically = true)
	@Query(value = UPDATE_BRAND_STATUS, nativeQuery = true)
	void updateBrandStatus(@Param("status") String status,@Param("brandId") long brandId);
	
	@Modifying(clearAutomatically = true)
	@Query(value = UPDATE_BRAND_STATUS_BY_NAME, nativeQuery = true)
	void updateBrandStatusByName(@Param("status") String status,@Param("brandName") String brandName);
	
	@Modifying(clearAutomatically = true)
	@Query(value = UPDATE_MERCHANT_STATUS, nativeQuery = true)
	void updateMerchantStatus(@Param("status") String status,@Param("merchantId") long merchantId);
	
    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_OFFER_STATUS_ACTIVE, nativeQuery = true)
    void updateOfferStatusActive();

    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_OFFER_STATUS_PENDING, nativeQuery = true)
    void updateOfferStatusPending();

    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_OFFER_STATUS_EXPIRED, nativeQuery = true)
    void updateOfferStatusExpired();

    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_OUTLET_STATUS_ACTIVE, nativeQuery = true)
    void updateOutletStatusActive();

    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_OUTLET_STATUS_INACTIVE, nativeQuery = true)
    void updateOutletStatusInactive();

    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_BRAND_STATUS_ACTIVE, nativeQuery = true)
    void updateBrandStatusActive();

    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_BRAND_STATUS_INACTIVE, nativeQuery = true)
    void updateBrandStatusInactive();

    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_MERCHANT_STATUS_ACTIVE, nativeQuery = true)
    void updateMerchantStatusActive();

    @Modifying(clearAutomatically = true)
    @Query(value = UPDATE_MERCHANT_STATUS_INACTIVE, nativeQuery = true)
    void updateMerchantStatusInactive();

    @Modifying(clearAutomatically = true)
    @Query(value = TRUNCATE_OFFER_REDEEM_OUTLETS, nativeQuery = true)
    void truncateOfferRedeemOutlets();

    @Modifying(clearAutomatically = true)
    @Query(value = INSERT_OFFER_REDEEM_OUTLETS, nativeQuery = true)
    void insertOfferRedeemOutlets();
}
