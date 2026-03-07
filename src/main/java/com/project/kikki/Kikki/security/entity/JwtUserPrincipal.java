package com.project.kikki.Kikki.security.entity;

import org.springframework.security.core.GrantedAuthority;

import java.util.List;

public record JwtUserPrincipal(
        Long userId,
        String usename,
        List<GrantedAuthority> authorities
)
{
    //Use this class to store the JWT pricipal
}
