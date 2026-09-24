package com.edunexus.lms.service;

import com.edunexus.lms.dto.request.CourseRequest;
import com.edunexus.lms.exception.ResourceNotFoundException;
import com.edunexus.lms.exception.UnauthorizedException;
import com.edunexus.lms.model.Course;
import com.edunexus.lms.model.Lesson;
import com.edunexus.lms.model.Module;
import com.edunexus.lms.model.User;
import com.edunexus.lms.repository.CourseRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses(String category, String difficulty, String search, String sort) {
        if (search != null && !search.isBlank()) {
            return courseRepository.searchCourses(search.trim());
        }
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            return courseRepository.findByCategoryIgnoreCaseAndPublishedTrue(category.trim());
        }
        if (difficulty != null && !difficulty.isBlank() && !difficulty.equalsIgnoreCase("All")) {
            return courseRepository.findByDifficultyIgnoreCaseAndPublishedTrue(difficulty.trim());
        }

        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("rating".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "rating");
        } else if ("students".equalsIgnoreCase(sort) || "popular".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "enrolledStudents");
        } else if ("price_asc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.DESC, "price");
        }

        return courseRepository.findByPublishedTrue(sortOrder);
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    public List<Course> getInstructorCourses(String instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    public Course createCourse(CourseRequest request, User instructor) {
        Course course = new Course();
        mapRequestToCourse(request, course);

        course.setInstructorId(instructor.getId());
        course.setInstructorName(instructor.getName());
        course.setInstructorBio(instructor.getBio() != null ? instructor.getBio() : "Senior Technology Specialist and Lead Instructor.");
        course.setInstructorImage(instructor.getProfileImage() != null ? instructor.getProfileImage() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");

        course.setSlug(toSlug(course.getTitle()) + "-" + UUID.randomUUID().toString().substring(0, 6));
        course.setRating(5.0);
        course.setReviewCount(0);
        course.setEnrolledStudents(0);
        course.setCreatedAt(Instant.now());
        course.setUpdatedAt(Instant.now());

        ensureModuleAndLessonIds(course);

        return courseRepository.save(course);
    }

    public Course updateCourse(String id, CourseRequest request, User user) {
        Course course = getCourseById(id);

        if (!course.getInstructorId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new UnauthorizedException("You do not have permission to edit this course");
        }

        mapRequestToCourse(request, course);
        course.setUpdatedAt(Instant.now());
        ensureModuleAndLessonIds(course);

        return courseRepository.save(course);
    }

    public void deleteCourse(String id, User user) {
        Course course = getCourseById(id);
        if (!course.getInstructorId().equals(user.getId()) && !"ADMIN".equals(user.getRole())) {
            throw new UnauthorizedException("You do not have permission to delete this course");
        }
        courseRepository.delete(course);
    }

    private void mapRequestToCourse(CourseRequest request, Course course) {
        course.setTitle(request.getTitle().trim());
        course.setSubtitle(request.getSubtitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setDifficulty(request.getDifficulty());
        course.setDuration(request.getDuration() != null ? request.getDuration() : "10h 30m");
        course.setThumbnail(request.getThumbnail() != null && !request.getThumbnail().isBlank()
                ? request.getThumbnail()
                : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60");
        course.setPrice(request.getPrice());
        course.setDiscountPrice(request.getDiscountPrice());
        course.setFree(request.isFree() || request.getPrice() == 0);
        course.setRequirements(request.getRequirements());
        course.setLearningOutcomes(request.getLearningOutcomes());
        course.setTargetAudience(request.getTargetAudience());
        course.setModules(request.getModules());
        course.setPublished(request.isPublished());
        course.setFeatured(request.isFeatured());
    }

    private void ensureModuleAndLessonIds(Course course) {
        if (course.getModules() == null) return;
        for (int mIdx = 0; mIdx < course.getModules().size(); mIdx++) {
            Module module = course.getModules().get(mIdx);
            if (module.getId() == null || module.getId().isBlank()) {
                module.setId("mod-" + (mIdx + 1) + "-" + UUID.randomUUID().toString().substring(0, 5));
            }
            module.setOrderIndex(mIdx + 1);

            if (module.getLessons() != null) {
                for (int lIdx = 0; lIdx < module.getLessons().size(); lIdx++) {
                    Lesson lesson = module.getLessons().get(lIdx);
                    if (lesson.getId() == null || lesson.getId().isBlank()) {
                        lesson.setId("les-" + (mIdx + 1) + "-" + (lIdx + 1) + "-" + UUID.randomUUID().toString().substring(0, 5));
                    }
                }
            }
        }
    }

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public static String toSlug(String input) {
        if (input == null) return "course";
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
