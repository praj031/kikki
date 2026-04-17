package com.project.kikki.Kikki.AI.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_token_usage")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiTokenUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String model;

    private String endpoint;

    private Integer promptTokens;
    private Integer completionTokens;
    private Integer totalTokens;

    private Long durationMs;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
