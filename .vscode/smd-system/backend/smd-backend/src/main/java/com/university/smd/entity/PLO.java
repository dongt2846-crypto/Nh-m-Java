package com.university.smd.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "plos")
public class PLO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String description;
    private String program;
    private String category;

    @OneToMany(mappedBy = "plo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CLO> clos;

    // Constructors
    public PLO() {}

    public PLO(String code, String description, String program, String category) {
        this.code = code;
        this.description = description;
        this.program = program;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<CLO> getClos() { return clos; }
    public void setClos(List<CLO> clos) { this.clos = clos; }
}