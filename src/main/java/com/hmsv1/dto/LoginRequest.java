package com.hmsv1.dto;

import lombok.*;

@Data
@NoArgsConstructor
@Setter
@Getter

public class LoginRequest {
    private String email;
    private String password;

    // Add explicit constructor since Lombok might not be working
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
}