package com.crayondata.merchantonboarding.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.crayondata.merchantonboarding.model.Address;
import com.crayondata.merchantonboarding.repository.AddressRepository;

@Controller
public class AddressController {
    
    @Autowired
    private AddressRepository addressRepository;
    
    @PostMapping("/api/address/upload")
    @ResponseBody
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile uploadfile) throws IOException {
        BufferedReader fileReader = new BufferedReader(
                new InputStreamReader(uploadfile.getInputStream(),"UTF-8"));

        List<Address> addresses = fileReader.lines().skip(1).map(line -> {
            String[] rowSplt = line.split("\t");
            return new Address(rowSplt[0], rowSplt[1], rowSplt[2], rowSplt[3]);
        }).collect(Collectors.toList());
        addresses.forEach(address -> addressRepository.save(address));
        fileReader.close();
        return new ResponseEntity<>("Address file successfully uploaded",HttpStatus.OK);
    }

}
