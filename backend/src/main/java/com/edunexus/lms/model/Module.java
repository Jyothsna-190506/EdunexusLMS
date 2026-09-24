package com.edunexus.lms.model;

import java.util.ArrayList;
import java.util.List;

public class Module {

    private String id;
    private String title;
    private String description;
    private int orderIndex;
    private List<Lesson> lessons = new ArrayList<>();

    public Module() {}

    public Module(String id, String title, String description, int orderIndex) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }

    public List<Lesson> getLessons() { return lessons; }
    public void setLessons(List<Lesson> lessons) { this.lessons = lessons; }
}
