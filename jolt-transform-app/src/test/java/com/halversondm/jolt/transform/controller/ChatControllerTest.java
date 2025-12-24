package com.halversondm.jolt.transform.controller;

import com.halversondm.jolt.transform.dto.TransformDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;

import java.lang.reflect.Field;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;

@ExtendWith(MockitoExtension.class)
public class ChatControllerTest {

    @Test
    public void generate_setsSpecFromGenerationOutput() throws Exception {
        // Arrange
        ChatController controller = new ChatController("dummy-key");

        // Mock the GoogleGenAiChatModel with deep stubs so we can chain call(...).getResult().getOutput().getText()
        GoogleGenAiChatModel chatModelMock = Mockito.mock(GoogleGenAiChatModel.class, RETURNS_DEEP_STUBS);

        // Mock the Generation and its chained output text
        Generation generationMock = Mockito.mock(Generation.class, RETURNS_DEEP_STUBS);
        Mockito.when(generationMock.getOutput().getText()).thenReturn("[]");

        // When chatModel.call(...).getResult() is invoked, return our mocked Generation
        Mockito.when(chatModelMock.call(any(Prompt.class)).getResult()).thenReturn(generationMock);

        // Inject the mock into the private field of the controller
        Field chatModelField = ChatController.class.getDeclaredField("chatModel");
        chatModelField.setAccessible(true);
        chatModelField.set(controller, chatModelMock);

        // Create a simple TransformDto
        TransformDto dto = new TransformDto();
        dto.setInput(Map.of("key", "value"));
        dto.setOutput(Map.of("other", "value2"));

        // Act
        TransformDto result = controller.generate(dto);

        // Assert
        assertSame(dto, result, "generate should return the same DTO instance");
        assertNotNull(result.getSpec(), "spec should be set on the DTO");
        assertTrue(result.getSpec().isEmpty(), "spec parsed from '[]' should be an empty list");

        // Verify the chatModel was called
        Mockito.verify(chatModelMock).call(any(Prompt.class));
    }
}

