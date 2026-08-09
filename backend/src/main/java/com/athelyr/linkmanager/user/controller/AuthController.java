package com.athelyr.linkmanager.user.controller;
import com.athelyr.linkmanager.user.dto.AuthResponseDTO;
import com.athelyr.linkmanager.user.dto.LoginRequestDTO;
import com.athelyr.linkmanager.user.dto.UserRequestDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.athelyr.linkmanager.user.service.UserService;

@RestController
@RequestMapping("/api/v.0.1/athelyr/linkmanager")
public class AuthController {
    private final  UserService userService;

    public AuthController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody UserRequestDTO userRequestDTO){
        return ResponseEntity.ok(userService.createUser(userRequestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO){
        return ResponseEntity.ok(userService.login(loginRequestDTO));
    }

}
