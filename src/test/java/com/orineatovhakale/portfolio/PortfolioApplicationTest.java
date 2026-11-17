package com.orineatovhakale.portfolio;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import com.orineatovhakale.portfolio.contact.ContactMessageRepository;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PortfolioApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @BeforeEach
    void clearContactMessages() {
        contactMessageRepository.deleteAll();
    }

    @Test
    void healthEndpointReportsApplicationIsUp() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void apiAllowsRequestsFromTheFrontendOrigin() throws Exception {
        mockMvc.perform(get("/api/profile").header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
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

    @Test
    void projectsEndpointReturnsPalekoHoldingsProject() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Paleko Holdings"))
                .andExpect(jsonPath("$[0].role").value("Software Developer"))
                .andExpect(jsonPath("$[0].technologies[0]").value("React"))
                .andExpect(jsonPath("$[0].technologies[1]").value("Node.js"))
                .andExpect(jsonPath("$[0].contributions.length()").value(3))
                .andExpect(jsonPath("$[0].liveUrl").value("https://palekoholdings.co.za"));
    }

    @Test
    void contactEndpointValidatesAndStoresMessage() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "  Alex Example  ",
                                  "email": "  alex@example.com  ",
                                  "message": "I would like to discuss a project."
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.receivedAt").isNotEmpty());

        var savedMessage = contactMessageRepository.findAll().getFirst();
        org.assertj.core.api.Assertions.assertThat(savedMessage.getId()).isNotNull();
    }

    @Test
    void contactEndpointRejectsInvalidEmail() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Alex Example",
                                  "email": "not-an-email",
                                  "message": "I would like to discuss a project."
                                }
                                """))
                .andExpect(status().isBadRequest());

        org.assertj.core.api.Assertions.assertThat(contactMessageRepository.count()).isZero();
    }
}
