package com.halversondm.jolt.transform.service;

import com.bazaarvoice.jolt.Chainr;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.halversondm.jolt.transform.dto.TransformDto;
import lombok.extern.slf4j.Slf4j;
import org.springaicommunity.mcp.annotation.McpTool;
import org.springaicommunity.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class TransformService {

    @McpTool(name = "transform", description = "Transforms input data using a JOLT specification.")
    public TransformDto transform(@McpToolParam TransformDto dto) throws JsonProcessingException {
        log.info("Transform start {}", dto);
        Chainr chainr = Chainr.fromSpec(dto.getSpec());
        Object output = chainr.transform(dto.getInput());
        dto.setOutput((Map<String, Object>) output);
        return dto;
    }
}
