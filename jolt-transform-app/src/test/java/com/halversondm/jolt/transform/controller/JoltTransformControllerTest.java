package com.halversondm.jolt.transform.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.halversondm.jolt.transform.dto.TransformDto;
import com.halversondm.jolt.transform.service.TransformService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class JoltTransformControllerTest {

    ObjectMapper objectMapper = new ObjectMapper();
    TransformService transformService = new TransformService();
    JoltTransformController unit;

    private List<Object> spec;
    private Map<String, Object> input;

    @BeforeEach
    void setUp() {
        unit = new JoltTransformController(transformService);
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("spec.jsonc")) {
            if (is == null) {
                throw new RuntimeException("spec.jsonc not found in classpath");
            }
            spec = objectMapper.readValue(is, List.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load spec.jsonc", e);
        }
        // Load the input.jsonc file from the classpath
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("input.jsonc")) {
            if (is == null) {
                throw new RuntimeException("input.jsonc not found in classpath");
            }
            input = objectMapper.readValue(is, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load input.jsonc", e);
        }
    }

    @Test
    void testTransform_Success() {
        TransformDto dto = new TransformDto();
        dto.setSpec(spec);
        dto.setInput(input);

        ResponseEntity<TransformDto> response = unit.transform(dto);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    @Test
    void testTransform_BadRequest() {
        TransformDto dto = new TransformDto();
        // Invalid spec to trigger exception
        dto.setSpec(null);
        dto.setInput(null);

        ResponseEntity<TransformDto> response = unit.transform(dto);

        assertEquals(400, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }
}
