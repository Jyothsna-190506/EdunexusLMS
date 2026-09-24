package com.edunexus.lms.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UserRoleUpdateRequest {
    @NotBlank(message = "Role is required (STUDENT, INSTRUCTOR, ADMIN)")
    private String role;

    public UserRoleUpdateRequest() {}

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
