package com.edunexus.lms.service;

import com.edunexus.lms.dto.request.ChangePasswordRequest;
import com.edunexus.lms.dto.request.LoginRequest;
import com.edunexus.lms.dto.request.RegisterRequest;
import com.edunexus.lms.dto.request.UpdateProfileRequest;
import com.edunexus.lms.dto.response.AuthResponse;
import com.edunexus.lms.exception.BadRequestException;
import com.edunexus.lms.exception.ResourceNotFoundException;
import com.edunexus.lms.model.User;
import com.edunexus.lms.repository.UserRepository;
import com.edunexus.lms.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.notificationService = notificationService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email address is already in use: " + email);
        }

        String role = "STUDENT";
        if (request.getRole() != null) {
            String reqRole = request.getRole().toUpperCase(Locale.ROOT);
            if (reqRole.equals("INSTRUCTOR") || reqRole.equals("ADMIN") || reqRole.equals("STUDENT")) {
                role = reqRole;
            }
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setStatus("ACTIVE");
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setProfileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");

        User savedUser = userRepository.save(user);

        // Send welcome notification
        try {
            notificationService.createNotification(
                    savedUser.getId(),
                    "Welcome to EduNexus LMS!",
                    "Your account has been successfully created. Explore our courses to start your learning journey.",
                    "SYSTEM",
                    "/courses"
            );
        } catch (Exception ignored) {}

        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getName(), savedUser.getRole());
        return new AuthResponse(token, savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new BadRequestException("Your account is currently " + user.getStatus().toLowerCase() + ". Please contact support.");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getName(), user.getRole());
        return new AuthResponse(token, user);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public User updateProfile(String email, UpdateProfileRequest request) {
        User user = getCurrentUser(email);
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getHeadline() != null) {
            user.setHeadline(request.getHeadline());
        }
        if (request.getProfileImage() != null && !request.getProfileImage().isBlank()) {
            user.setProfileImage(request.getProfileImage());
        }
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = getCurrentUser(email);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }
}
