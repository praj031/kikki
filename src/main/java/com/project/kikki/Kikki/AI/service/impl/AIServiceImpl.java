package com.project.kikki.Kikki.AI.service.impl;


import com.project.kikki.Kikki.AI.advisor.TokenUsageAdvisor;
import com.project.kikki.Kikki.AI.service.AIService;
import com.project.kikki.Kikki.security.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.VectorStoreChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.VectorStoreRetriever;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Service;

import java.util.Map;

import static com.project.kikki.Kikki.AI.utils.Prompts.SYSTEM_PROMPT;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIServiceImpl implements AIService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final ChatMemory chatMemory;
    private final TokenUsageAdvisor tokenUsageAdvisor;

    @Override
    public String askAI(String question, Long userId) {
        PromptTemplate promptTemplate = new PromptTemplate(SYSTEM_PROMPT);
        String renderText = promptTemplate.render(Map.of("question",question));

        return chatClient.prompt()
                .user(renderText)
                .advisors(advisorSpec -> advisorSpec
                        .param("userId", userId)
                )
                .advisors(
                        //This will be a short term memory advisor.
                        MessageChatMemoryAdvisor.builder(chatMemory)
                                .conversationId(String.valueOf(userId))
                                .build()
                        ,
                        //This will be a long term memory advisor.
                        VectorStoreChatMemoryAdvisor.builder(vectorStore)
                                .conversationId(String.valueOf(userId))
                                .defaultTopK(10)
                                .build()
                        ,
                        tokenUsageAdvisor

                )
                .call()
                .content();
    }
}
