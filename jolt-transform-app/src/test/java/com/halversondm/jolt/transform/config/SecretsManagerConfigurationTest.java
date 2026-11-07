package com.halversondm.jolt.transform.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.Test;
import org.mockito.Answers;
import org.mockito.MockedStatic;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClientBuilder;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SecretsManagerConfigurationTest {

    private final SecretsManagerConfiguration configuration = new SecretsManagerConfiguration();

    @Test
    void googleApiKeyIsReadFromSecretsManager() {
        SecretsManagerClient client = mock(SecretsManagerClient.class);
        when(client.getSecretValue(any(GetSecretValueRequest.class)))
                .thenReturn(GetSecretValueResponse.builder()
                        .secretString("{\"GOOGLE_API_KEY\":\"abc123\"}")
                        .build());

        try (MockedStatic<SecretsManagerClient> clientStatic = mockStatic(SecretsManagerClient.class)) {
            SecretsManagerClientBuilder builder = mock(SecretsManagerClientBuilder.class, Answers.RETURNS_SELF);
            when(builder.build()).thenReturn(client);
            clientStatic.when(SecretsManagerClient::builder).thenReturn(builder);

            assertEquals("abc123", configuration.googleApiKey());

            verify(builder).region(Region.US_EAST_1);
            verify(client).getSecretValue(GetSecretValueRequest.builder()
                    .secretId(SecretsManagerConfiguration.PROD_GOOGLEAI)
                    .build());
            verify(client).close();
        }
    }

    @Test
    void googleApiKeyWithMalformedSecretThrowsRuntimeException() {
        SecretsManagerClient client = mock(SecretsManagerClient.class);
        when(client.getSecretValue(any(GetSecretValueRequest.class)))
                .thenReturn(GetSecretValueResponse.builder().secretString("not json").build());

        try (MockedStatic<SecretsManagerClient> clientStatic = mockStatic(SecretsManagerClient.class)) {
            SecretsManagerClientBuilder builder = mock(SecretsManagerClientBuilder.class, Answers.RETURNS_SELF);
            when(builder.build()).thenReturn(client);
            clientStatic.when(SecretsManagerClient::builder).thenReturn(builder);

            RuntimeException e = assertThrows(RuntimeException.class, configuration::googleApiKey);
            assertInstanceOf(JsonProcessingException.class, e.getCause());
            verify(client).close();
        }
    }
}
