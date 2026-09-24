package com.edunexus.lms.model;

import java.util.ArrayList;
import java.util.List;

public class Lesson {

    private String id;
    private String title;
    private String description;
    private String videoUrl;
    private String duration; // e.g. "12:45"
    private boolean isFreePreview;
    private String textContent;
    private List<String> resources = new ArrayList<>();

    public Lesson() {}

    public Lesson(String id, String title, String description, String videoUrl, String duration, boolean isFreePreview) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.duration = duration;
        this.isFreePreview = isFreePreview;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public boolean isFreePreview() { return isFreePreview; }
    public void setFreePreview(boolean freePreview) { isFreePreview = freePreview; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public List<String> getResources() { return resources; }
    public void setResources(List<String> resources) { this.resources = resources; }
}
