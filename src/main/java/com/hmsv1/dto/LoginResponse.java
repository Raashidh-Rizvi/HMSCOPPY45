package com.hmsv1.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginResponse {
    // getters and setters
    private String token;
    private UserDto user;
    private String message;

    public LoginResponse(String token, UserDto user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }

}
