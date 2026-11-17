package com.orineatovhakale.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthEndpointReportsApplicationIsUp() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void profileEndpointReturnsPublicProfile() throws Exception {
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$.name").value("Orinea Tovhakale"))
                .andExpect(jsonPath("$.title").value("Software Developer / Data Scientist"))
                .andExpect(jsonPath("$.tagline").value(
                        "Building Technology. Understanding Data. Creating Impact."
                ))
                .andExpect(jsonPath("$.biography").value(
                        """
                                I am a Software Developer passionate about engineering intelligent, scalable and meaningful digital solutions. My interests span Java development and the Spring ecosystem, including OOP, IoC, DI, Spring Boot, RESTful APIs, JWT authentication, Spring Security, microservices and asynchronous communication using Apache Kafka, alongside containerization and orchestration with Docker and Kubernetes.

                                Alongside software engineering, I work in Data Analytics, Research and Business Intelligence, exploring datasets, analysing leads, tracking business growth, identifying trends and transforming raw data into actionable insights that support informed decision-making.

                                Driven by curiosity and continuous learning, I strive to bridge technology and data to solve problems, build with purpose and create meaningful impact.
                                """
                ));
    }
}
