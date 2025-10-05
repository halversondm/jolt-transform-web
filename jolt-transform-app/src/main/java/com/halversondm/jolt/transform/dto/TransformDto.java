package com.halversondm.jolt.transform.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class TransformDto {
    private Map<String, Object> input;
    private List<Object> spec;
    private Map<String, Object> output;
}
