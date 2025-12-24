package com.halversondm.jolt.transform;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class JoltTransformAppApplicationTests {

    @TestConfiguration
    static class TestConfig {
        @Bean
        public String googleApiKey() {
            return "This is an example bean for testing purposes.";
        }
    }

	@Test
	void contextLoads() {
	}

}
