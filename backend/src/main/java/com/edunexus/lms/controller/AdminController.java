package com.edunexus.lms.controller;

import com.edunexus.lms.dto.request.UserRoleUpdateRequest;
import com.edunexus.lms.dto.request.UserStatusUpdateRequest;
import com.edunexus.lms.dto.response.InstructorStatsResponse;
import com.edunexus.lms.dto.response.StatsResponse;
import com.edunexus.lms.model.User;
import com.edunexus.lms.security.UserPrincipal;
import com.edunexus.lms.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/admin/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserStatus(@PathVariable String id,
                                                 @Valid @RequestBody UserStatusUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, request.getStatus()));
    }

    @PutMapping("/admin/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserRole(@PathVariable String id,
                                               @Valid @RequestBody UserRoleUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateUserRole(id, request.getRole()));
    }

    @GetMapping("/admin/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StatsResponse> getPlatformStatistics() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }

    @GetMapping("/instructor/statistics")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<InstructorStatsResponse> getInstructorStatistics(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(adminService.getInstructorStats(principal.getId()));
    }
}
