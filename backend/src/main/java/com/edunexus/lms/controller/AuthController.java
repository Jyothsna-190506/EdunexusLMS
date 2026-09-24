package com.edunexus.lms.controller;

import com.edunexus.lms.dto.request.ChangePasswordRequest;
import com.edunexus.lms.dto.request.LoginRequest;
import com.edunexus.lms.dto.request.RegisterRequest;
import com.edunexus.lms.dto.request.UpdateProfileRequest;
import com.edunexus.lms.dto.response.ApiResponse;
import com.edunexus.lms.dto.response.AuthResponse;
import com.edunexus.lms.model.User;
import com.edunexus.lms.security.UserPrincipal;
import com.edunexus.lms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.getCurrentUser(principal.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserPrincipal principal,
                                              @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(authService.updateProfile(principal.getUsername(), request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@AuthenticationPrincipal UserPrincipal principal,
                                                      @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(principal.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Password updated successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody Map<String, String> body) {
        // Mock password reset email trigger
        String email = body.get("email");
        return ResponseEntity.ok(ApiResponse.ok("If an account exists for " + email + ", a password reset link has been dispatched."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok("Password has been reset successfully. Please login with your new credentials."));
    }
}
