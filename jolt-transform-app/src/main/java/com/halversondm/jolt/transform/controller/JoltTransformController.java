package com.halversondm.jolt.transform.controller;

import com.bazaarvoice.jolt.Chainr;
import com.halversondm.jolt.transform.dto.TransformDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/jolt")
public class JoltTransformController {

    @PostMapping(value = "/transform", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @SuppressWarnings("unchecked")
    public ResponseEntity<TransformDto> transform(@RequestBody TransformDto dto) {
        try {
            Chainr chainr = Chainr.fromSpec(dto.getSpec());
            Object output = chainr.transform(dto.getInput());
            dto.setOutput((Map<String, Object>) output);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            // Optionally, handle error and return a proper error response
            return ResponseEntity.badRequest().body(dto);
        }
    }
}
