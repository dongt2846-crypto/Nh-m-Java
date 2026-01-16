package com.university.smd.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clos")
public class CLO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "syllabus_id")
    private Syllabus syllabus;

    private String code;
    private String description;
    private String bloomLevel;
    private Double weight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plo_id")
    private PLO plo;

    // Constructors
    public CLO() {}

    public CLO(Syllabus syllabus, String code, String description, String bloomLevel, Double weight) {
        this.syllabus = syllabus;
        this.code = code;
        this.description = description;
        this.bloomLevel = bloomLevel;
        this.weight = weight;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Syllabus getSyllabus() { return syllabus; }
    public void setSyllabus(Syllabus syllabus) { this.syllabus = syllabus; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBloomLevel() { return bloomLevel; }
    public void setBloomLevel(String bloomLevel) { this.bloomLevel = bloomLevel; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public PLO getPlo() { return plo; }
    public void setPlo(PLO plo) { this.plo = plo; }
}