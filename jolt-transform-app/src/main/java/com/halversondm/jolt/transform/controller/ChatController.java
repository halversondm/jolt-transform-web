package com.halversondm.jolt.transform.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.genai.Client;
import com.halversondm.jolt.transform.dto.TransformDto;
import io.micrometer.observation.ObservationRegistry;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.MapOutputConverter;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.ai.model.tool.ToolCallingManager;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@Slf4j
public class ChatController {

    public static final String INPUT_JSON = "inputJson";
    public static final String OUTPUT_JSON = "outputJson";
    public static final String FORMAT = "format";
    private String googleApiKey;

    private GoogleGenAiChatModel chatModel;

    private MapOutputConverter mapOutputConverter = new MapOutputConverter();

    private String promptText = """
            You are an expert in json to json transformations using JOLT specification from bazaarvoice. Given input and output JSON data, generate the appropriate Jolt specification to transform the input into the output.  The output is a well formed json with no comments or markdown.
            
            Here is the input and output data:
            Input JSON:
            {inputJson}
            
            Output JSON:
            {outputJson}
            
            {format}
            """;

    public ChatController(String googleApiKey) {
        this.googleApiKey = googleApiKey;
    }

    @PostConstruct
    public void init() {
        Client genAiClient = Client.builder()
                .apiKey(this.googleApiKey)
                .build();
        this.chatModel = new GoogleGenAiChatModel(genAiClient,
                GoogleGenAiChatOptions.builder()
                        .model(GoogleGenAiChatModel.ChatModel.GEMINI_2_5_FLASH)
                        .temperature(0.0)
                        .build(), ToolCallingManager.builder().build(), RetryTemplate.builder()
                .maxAttempts(10)
                .fixedBackoff(1000)
                .build(), ObservationRegistry.NOOP);
    }

    @PostMapping("/generate")
    public TransformDto generate(@RequestBody TransformDto transformDto) throws JsonProcessingException {
        log.info("Received request for {}", transformDto);
        Map<String, Object> variables = Map.of(INPUT_JSON, transformDto.getInputAsString(), OUTPUT_JSON, transformDto.getOutputAsString(), FORMAT, mapOutputConverter.getFormat());
        Prompt prompt = PromptTemplate.builder()
                .template(promptText)
                .variables(variables)
                .build()
                .create();
        log.debug("Prompt: {}", prompt);
        Generation generation = chatModel.call(prompt).getResult();
        log.debug("{}", generation.getOutput());
        transformDto.setSpecFromString(generation.getOutput().getText());
        return transformDto;
    }

}
