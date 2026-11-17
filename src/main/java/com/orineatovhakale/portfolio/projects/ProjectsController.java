package com.orineatovhakale.portfolio.projects;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectsController {

    private final List<ProjectResponse> projects = List.of(
            new ProjectResponse(
                    "Paleko Holdings",
                    "Paleko Holdings provides electrical services and certificates of compliance to residential, commercial, and industrial clients, with a focus on safe, efficient work and customer satisfaction.",
                    "Software Developer",
                    List.of("React", "Node.js"),
                    List.of(
                            "Built and maintained the website frontend",
                            "Built the backend",
                            "Developed and maintained the SEO setup"
                    ),
                    "https://palekoholdings.co.za"
            )
    );

    @GetMapping
    public List<ProjectResponse> getProjects() {
        return projects;
    }

    public record ProjectResponse(
            String name,
            String description,
            String role,
            List<String> technologies,
            List<String> contributions,
            String liveUrl
    ) {
    }
}
