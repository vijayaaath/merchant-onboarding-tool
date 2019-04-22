package com.crayondata.merchantonboarding.service;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.S3ClientOptions;
import com.amazonaws.services.s3.model.AccessControlList;
import com.amazonaws.services.s3.model.GroupGrantee;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.Permission;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.crayondata.merchantonboarding.model.Images;
import com.crayondata.merchantonboarding.repository.BrandRepository;

@Service
public class BrandService {
	@Autowired
	BrandRepository brandRepository;
	
	@Value("${image.height:0}")
    private int compHeight;
	
	@Value("${image.width:0}")
    private int compWidth;
	
	@Value("${aws.brand.file.path:null}")
	public String awsBrandPath;
	
	@Value("${aws.offer.file.path:null}")
	public String awsOfferPath;
	
	@Value("${aws.bucket.name:null}")
	public String awsBucketName;
	
	@Value("${aws.access.key:null}")
    private String awsAccessKey;
	
	@Value("${aws.secret.key:null}")
    private String awsSecretKey;
	
	@Value("${aws.domain.name:null}")
	public String awsDomainName;
	
	public Set<Images> uploadImages(List<MultipartFile> imageList, String type, Long id) throws IOException, SQLException{
		Set<Images> imageSet = new HashSet<>();
		AmazonS3 s3client = null;
		AccessControlList acl = null;
		ClientConfiguration clientConfiguration = new ClientConfiguration();
		//File file = null;
		
		String awsPath = null;
		if(type.equals("brand"))
			awsPath = awsBrandPath;
		else if(type.equals("offer"))
			awsPath = awsOfferPath;
		
		s3client = new AmazonS3Client(new BasicAWSCredentials(awsAccessKey,awsSecretKey),clientConfiguration);
		s3client.setS3ClientOptions(S3ClientOptions.builder().setPathStyleAccess(true).disableChunkedEncoding().build());
		/*ObjectListing listing = s3client.listObjects(awsBucketName, awsPath);
		List<S3ObjectSummary> summaries = listing.getObjectSummaries();
		List<String> keys = new ArrayList<String>();

		while (listing.isTruncated()) {
			listing = s3client.listNextBatchOfObjects(listing);
			summaries.addAll(listing.getObjectSummaries());
		}
		for (S3ObjectSummary objSum : summaries) {
			String key = objSum.getKey().toString();
			keys.add(key);
		}*/
		int imageNumber = 0;
		for (MultipartFile image : imageList) {
				String imageName = null;
				String filePath = null;
				acl = new AccessControlList();
				acl.grantPermission(GroupGrantee.AllUsers, Permission.Read);
				BufferedImage imBuff = ImageIO.read(image.getInputStream());
				imageNumber++;
				String fileName = image.getOriginalFilename();
				imageName = type + "_" + id + "_" + imageNumber + fileName.substring(fileName.lastIndexOf("."));
				ObjectMetadata meta = new ObjectMetadata();
				meta.setContentLength(image.getSize());
				filePath = awsPath + imageName;
				/*
				 * if(keys.contains(filePath)){ continue; }
				 */
				if (compHeight != 0 && compWidth != 0) {
					if (imBuff.getHeight() >= compHeight && imBuff.getWidth() >= compWidth) {
						s3client.putObject(new PutObjectRequest(awsBucketName, filePath, image.getInputStream(), meta)
								.withAccessControlList(acl));
						Images imageUrl = new Images();
						imageUrl.setImage(imageName);
						imageSet.add(imageUrl);
					}
				} else if (compHeight != 0 && compWidth == 0) {
					if (imBuff.getHeight() >= compHeight) {
						s3client.putObject(new PutObjectRequest(awsBucketName, filePath, image.getInputStream(), meta)
								.withAccessControlList(acl));
						Images imageUrl = new Images();
						imageUrl.setImage(imageName);
						imageSet.add(imageUrl);
					}
				} else if (compHeight == 0 && compWidth != 0) {
					if (imBuff.getWidth() >= compWidth) {
						s3client.putObject(new PutObjectRequest(awsBucketName, filePath, image.getInputStream(), meta)
								.withAccessControlList(acl));
						Images imageUrl = new Images();
						imageUrl.setImage(imageName);
						imageSet.add(imageUrl);
					}
				} else if (compHeight == 0 && compWidth == 0) {
					/*
					 * ObjectMetadata meta = new ObjectMetadata();
					 * meta.setContentLength(image.getSize());
					 */
					s3client.putObject(new PutObjectRequest(awsBucketName, filePath, image.getInputStream(), meta)
							.withAccessControlList(acl));
					Images imageUrl = new Images();
					imageUrl.setImage(imageName);
					imageSet.add(imageUrl);
				}
			}
		return imageSet;
	}
}
