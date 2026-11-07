package com.halversondm.jolt.transform;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.boot.SpringApplication;

import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;

class JoltTransformAppApplicationMainTest {

    @Test
    void mainDelegatesToSpringApplicationRun() {
        String[] args = {"--example"};
        try (MockedStatic<SpringApplication> spring = mockStatic(SpringApplication.class)) {
            JoltTransformAppApplication.main(args);
            spring.verify(() -> SpringApplication.run(JoltTransformAppApplication.class, args), times(1));
        }
    }
}
