package com.halversondm.jolt.transform.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.halversondm.jolt.transform.service.TransformService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
import software.amazon.awssdk.services.secretsmanager.model.SecretsManagerException;

import java.util.Map;

@Configuration
@Slf4j
@Profile("!test")
public class SecretsManagerConfiguration {

    public static final String PROD_GOOGLEAI = "prod/googleai";
    public static final String GOOGLE_API_KEY = "GOOGLE_API_KEY";

    @Bean
    public String googleApiKey() {
        try (SecretsManagerClient secretsClient = SecretsManagerClient.builder()
                .region(Region.US_EAST_1)
                .build()) {
            GetSecretValueRequest valueRequest = GetSecretValueRequest.builder()
                    .secretId(PROD_GOOGLEAI)
                    .build();
            GetSecretValueResponse valueResponse = secretsClient.getSecretValue(valueRequest);
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> map = objectMapper.readValue(valueResponse.secretString(), new TypeReference<Map<String, Object>>() {});
            return map.get(GOOGLE_API_KEY).toString();
        } catch (SecretsManagerException e) {
            log.error(e.awsErrorDetails().errorMessage());
            System.exit(1);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return "";
    }

}
