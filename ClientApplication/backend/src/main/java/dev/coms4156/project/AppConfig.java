package dev.coms4156.project;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AppConfig {

  @Bean
  public WebClient webClient(WebClient.Builder builder) {
    return builder.baseUrl("http://localhost:8080").build();
  }

}