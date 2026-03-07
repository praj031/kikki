package com.project.kikki.Kikki.AI.controller;


import com.project.kikki.Kikki.AI.service.AIService;
import com.project.kikki.Kikki.security.service.JWTService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping(path = "/askAI")
public class AIController {

    private final AIService aiService;
    private final JWTService jwtService;

    @PostMapping()
    public ResponseEntity<String> askAI(
            @RequestBody String question,
            @RequestHeader("Authorization") String authHeader
    ){

        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtService.getUserIdFromToken(token);

        log.info("Inside as AI");
        var response = aiService.askAI(question,userId);
        return ResponseEntity.ok(response);
    }

}
