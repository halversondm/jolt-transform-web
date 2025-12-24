package com.halversondm.jolt.transform.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@Data
@ToString
public class TransformDto {

    @JsonIgnore
    private ObjectMapper objectMapper = new ObjectMapper();

    @JsonProperty("input")
    private Map<String, Object> input;
    @JsonProperty("spec")
    private List<Object> spec;
    @JsonProperty("output")
    private Map<String, Object> output;

    @JsonIgnore
    public String getInputAsString() throws JsonProcessingException {
        return objectMapper.writeValueAsString(input);
    }

    @JsonIgnore
    public String getOutputAsString() throws JsonProcessingException {
        return objectMapper.writeValueAsString(output);
    }

    @JsonIgnore
    public void setSpecFromString(String specJson) throws JsonProcessingException {
        this.spec = objectMapper.readValue(specJson, List.class);
    }
}
