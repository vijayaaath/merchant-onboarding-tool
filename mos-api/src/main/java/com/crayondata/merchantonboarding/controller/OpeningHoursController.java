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
import com.crayondata.merchantonboarding.model.OpeningHours;
import com.crayondata.merchantonboarding.repository.AddressRepository;
import com.crayondata.merchantonboarding.repository.OpeningHoursRepository;

@Controller
public class OpeningHoursController {
    @Autowired
    private OpeningHoursRepository openingHoursRepository;
    
    @PostMapping("/api/openingHours/upload")
    @ResponseBody
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile uploadfile) throws IOException {
        BufferedReader fileReader = new BufferedReader(
                new InputStreamReader(uploadfile.getInputStream(),"UTF-8"));

        List<OpeningHours> openingHours = fileReader.lines().skip(1).map(line -> {
            String[] rowSplt = line.split("\t");
            return new OpeningHours(rowSplt[0], rowSplt[1], rowSplt[2], rowSplt[3], rowSplt[4], rowSplt[5], rowSplt[6], rowSplt[7]);
        }).collect(Collectors.toList());
        openingHours.forEach(openingHour -> openingHoursRepository.save(openingHour));
        fileReader.close();
        return new ResponseEntity<>("OpeningHours file successfully uploaded",HttpStatus.OK);
    }
}
