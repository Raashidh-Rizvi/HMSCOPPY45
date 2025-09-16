package com.hmsv1.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDto {
    private Long id;
    private String username;
    private String role;
    private String name;
    private String email;
    private String password;


}
