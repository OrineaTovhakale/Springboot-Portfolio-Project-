package com.orineatovhakale.portfolio.profile;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @GetMapping
    public ProfileResponse getProfile() {
        return new ProfileResponse(
                "Orinea Tovhakale",
                "Software Developer / Data Scientist",
                "Building Technology. Understanding Data. Creating Impact.",
                """
                        I am a Software Developer passionate about engineering intelligent, scalable and meaningful digital solutions. My interests span Java development and the Spring ecosystem, including OOP, IoC, DI, Spring Boot, RESTful APIs, JWT authentication, Spring Security, microservices and asynchronous communication using Apache Kafka, alongside containerization and orchestration with Docker and Kubernetes.

                        Alongside software engineering, I work in Data Analytics, Research and Business Intelligence, exploring datasets, analysing leads, tracking business growth, identifying trends and transforming raw data into actionable insights that support informed decision-making.

                        Driven by curiosity and continuous learning, I strive to bridge technology and data to solve problems, build with purpose and create meaningful impact.
                        """
        );
    }

    public record ProfileResponse(String name, String title, String tagline, String biography) {
    }
}
