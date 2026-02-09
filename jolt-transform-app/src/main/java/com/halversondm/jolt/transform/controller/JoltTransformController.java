package com.halversondm.jolt.transform.controller;

import com.halversondm.jolt.transform.service.TransformService;
import com.halversondm.jolt.transform.dto.TransformDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/jolt")
public class JoltTransformController {

    private final TransformService transformService;

    public JoltTransformController(TransformService transformService) {
        this.transformService = transformService;
    }

    @PostMapping(value = "/transform", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @SuppressWarnings("unchecked")
    public ResponseEntity<TransformDto> transform(@RequestBody TransformDto dto) {
        try {
            dto = transformService.transform(dto);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(dto);
        }
    }
}
