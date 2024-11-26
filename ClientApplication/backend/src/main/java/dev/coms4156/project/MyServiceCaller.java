package dev.coms4156.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class MyServiceCaller {

  @Autowired
  private WebClient webClient;

  @Value("${client.id}")
  private String clientId;

  @Value("${service.url}")
  private String baseUrl;

  public String getEmployeeInfo(String employeeId) {

    String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .path("/getEmpInfo")
      .queryParam("cid", clientId)
      .queryParam("eid", employeeId)
      .toUriString();

    System.out.println("Constructed URL: " + url);

    // Call the service using clientId as part of the URL path
    String response = webClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/getEmpInfo")
        .queryParam("cid", clientId)
        .queryParam("eid", employeeId)
        .build())
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }

  public String registerNewEmployee(String fullName, int departmentId, String hireDate, String position) {

    // Call addEmpToDept
    String response = webClient.post()
      .uri(uriBuilder -> uriBuilder
        .path("/addEmpToDept")
        .queryParam("cid", clientId)
        .queryParam("did", departmentId)
        .queryParam("name", fullName)
        .queryParam("hireDate", hireDate)
        .queryParam("position", position)
        .build())
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }

}