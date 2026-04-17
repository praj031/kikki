package com.project.kikki.Kikki.security.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String firstName;
    private String lastName;
    private String fullName;
}
