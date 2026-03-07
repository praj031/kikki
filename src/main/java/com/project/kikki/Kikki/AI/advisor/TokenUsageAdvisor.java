package com.project.kikki.Kikki.AI.advisor;


import com.project.kikki.Kikki.AI.entity.AiTokenUsage;
import com.project.kikki.Kikki.AI.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClientRequest;
import org.springframework.ai.chat.client.ChatClientResponse;
import org.springframework.ai.chat.client.advisor.api.CallAdvisor;
import org.springframework.ai.chat.client.advisor.api.CallAdvisorChain;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class TokenUsageAdvisor implements CallAdvisor {

    private final TokenRepository tokenRepository;

    @Override
    public ChatClientResponse adviseCall(ChatClientRequest chatClientRequest, CallAdvisorChain callAdvisorChain) {

        long startTime = System.currentTimeMillis();
//        String userId = (String) chatClientRequest.context()
//                .getOrDefault("conversationId", "userId");

        Long userId = (Long) chatClientRequest.context()
                .get("userId");

        // 1. Pass the request down the chain (to the LLM)
        ChatClientResponse advisedResponse = callAdvisorChain.nextCall(chatClientRequest);

        // 2. Extract the actual LLM response
        ChatResponse chatResponse = advisedResponse.chatResponse();

        // 3. Inspect Usage Metadata
        if (chatResponse != null && chatResponse.getMetadata().getUsage() != null) {
            var usage = chatResponse.getMetadata().getUsage();
            long duration = System.currentTimeMillis() - startTime;

            log.info("💰 Token Usage: Input={} | Output={} | Total={} | Time={}ms",
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
        //Name of the advice I want to call
        return "ChatClientResponse";
    }

    @Override
    public int getOrder() {
        //Sequence where, in i want to put this advisor in advisor list
        return 0;
    }
}
