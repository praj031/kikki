package com.project.kikki.Kikki.AI.advisor;

import com.project.kikki.Kikki.AI.entity.AiTokenUsage;
import com.project.kikki.Kikki.AI.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.advisor.api.AdvisedRequest;
import org.springframework.ai.chat.client.advisor.api.AdvisedResponse;
import org.springframework.ai.chat.client.advisor.api.CallAroundAdvisor;
import org.springframework.ai.chat.client.advisor.api.CallAroundAdvisorChain;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class TokenUsageAdvisor implements CallAroundAdvisor {

    private final TokenRepository tokenRepository;

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest advisedRequest, CallAroundAdvisorChain chain) {

        long startTime = System.currentTimeMillis();

        Long userId = (Long) advisedRequest.adviseContext()
                .get("userId");

        // 1. Pass the request down the chain (to the LLM)
        AdvisedResponse advisedResponse = chain.nextAroundCall(advisedRequest);

        // 2. Extract the actual LLM response
        ChatResponse chatResponse = advisedResponse.response();

        // 3. Inspect Usage Metadata
        if (chatResponse != null && chatResponse.getMetadata().getUsage() != null) {
            var usage = chatResponse.getMetadata().getUsage();
            long duration = System.currentTimeMillis() - startTime;

            log.info("Token Usage: Input={} | Output={} | Total={} | Time={}ms",
                    usage.getPromptTokens(),
                    usage.getCompletionTokens(),
                    usage.getTotalTokens(),
                    duration);

            // make a db call to store the tokens count
            AiTokenUsage entity = AiTokenUsage.builder()
                    .userId(String.valueOf(userId))
                    .model("Chat-Gpt-Mini-04")
                    .endpoint("/api/askAIWithRAGAdvisor")
                    .promptTokens(usage.getPromptTokens())
                    .completionTokens(usage.getCompletionTokens())
                    .totalTokens(usage.getTotalTokens())
                    .durationMs(duration)
                    .build();

            tokenRepository.save(entity);
        }
        return advisedResponse;
    }

    @Override
    public String getName() {
        return "TokenUsageAdvisor";
    }

    @Override
    public int getOrder() {
        return Integer.MAX_VALUE; // Run last to capture final response
    }
}