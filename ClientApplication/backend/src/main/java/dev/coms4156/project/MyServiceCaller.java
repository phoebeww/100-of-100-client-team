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

  @Value("${api.key}")
  private String apiKey;

  public String getEmployeeInfo(String employeeId) {

    // Call the service using clientId as part of the URL path
    String response = webClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/getEmpInfo")
        .queryParam("cid", clientId)
        .queryParam("eid", employeeId)
        .build())
      .header("Authorization", apiKey)
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
      .header("Authorization", apiKey)
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }

  public String getOrganizationInfo() {

    // Call the service using WebClient
    String response = webClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/getOrgInfo")
        .queryParam("cid", clientId)
        .build())
      .header("Authorization", apiKey) // Add API key in the header
      .retrieve()
      .bodyToMono(String.class)
      .block(); // Synchronous call to block and wait for the response

    return response;
  }

  public String getDepartmentInfo(int departmentId) {

    // Call the service using WebClient
    String response = webClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/getDeptInfo")
        .queryParam("cid", clientId)
        .queryParam("did", departmentId)
        .build())
      .header("Authorization", apiKey) // Add API key in the header
      .retrieve()
      .bodyToMono(String.class)
      .block(); // Synchronous call to block and wait for the response

    return response;
  }

  /**
   * Calls the service to retrieve employee information.
   *
   * @param employeeId the employee ID
   * @return the information of the employee
   */
  public String getEmployeeInfo(int employeeId) {
    String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .path("/getEmpInfo")
      .queryParam("cid", clientId)
      .queryParam("eid", employeeId)
      .toUriString();

    System.out.println("Constructed URL for Employee Info: " + url);

    String response = webClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/getEmpInfo")
        .queryParam("cid", clientId)
        .queryParam("eid", employeeId)
        .build())
      .header("Authorization", apiKey)
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }

  public String getDepartmentBudgetStatistics(int departmentId) {

    // Call the service using WebClient
    String response = webClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/statDeptBudget")
        .queryParam("cid", clientId)
        .queryParam("did", departmentId)
        .build())
      .header("Authorization", apiKey) // Add API key in the header
      .retrieve()
      .bodyToMono(String.class)
      .block(); // Synchronous call to block and wait for the response

    return response;
  }

  /**
   * Calls the service to retrieve department performance statistics.
   *
   * @param departmentId the department ID
   * @return the performance statistics of the department
   */
  public String getDepartmentPerformanceStatistics(int departmentId) {

    String response = webClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/statDeptPerf")
        .queryParam("cid", clientId)
        .queryParam("did", departmentId)
        .build())
      .header("Authorization", apiKey)
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }

  /**
   * Calls the service to retrieve department position statistics.
   *
   * @param departmentId the department ID
   * @return the position statistics of the department
   */
  public String getDepartmentPositionStatistics(int departmentId) {

    String response = webClient.get()
      .uri(uriBuilder -> uriBuilder
        .path("/statDeptPos")
        .queryParam("cid", clientId)
        .queryParam("did", departmentId)
        .build())
      .header("Authorization", apiKey)
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }

  /**
   * Calls the service to set the head of a department.
   *
   * @param departmentId the department ID
   * @param employeeId   the employee ID
   * @return the response from the service
   */
  public String setDepartmentHead(int departmentId, int employeeId) {

    String response = webClient.patch()
      .uri(uriBuilder -> uriBuilder
        .path("/setDeptHead")
        .queryParam("cid", clientId)
        .queryParam("did", departmentId)
        .queryParam("eid", employeeId)
        .build())
      .header("Authorization", apiKey)
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }

  /**
   * Calls the service to update an employee's information.
   *
   * @param employeeId the employee ID
   * @param position   (optional) the position to update
   * @param salary     (optional) the salary to update
   * @param performance (optional) the performance to update
   * @return the response from the service
   */
  public String updateEmployeeInfo(int employeeId, String position, Double salary, Double performance) {
    UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .path("/updateEmpInfo")
      .queryParam("cid", clientId)
      .queryParam("eid", employeeId);

    // Add optional parameters only if they are not null
    if (position != null) {
      uriBuilder.queryParam("position", position);
    }
    if (salary != null) {
      uriBuilder.queryParam("salary", salary);
    }
    if (performance != null) {
      uriBuilder.queryParam("performance", performance);
    }

    String url = uriBuilder.toUriString();
    System.out.println("Constructed URL for Update Employee Info: " + url);

    String response = webClient.patch()
      .uri(uriBuilder.build().toUri())
      .header("Authorization", apiKey)
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }

  /**
   * Calls the service to add an employee to a department.
   *
   * @param departmentId the department ID
   * @param name the employee name
   * @param hireDate the hire date of the employee
   * @param position (optional) the position of the employee
   * @param salary (optional) the salary of the employee
   * @param performance (optional) the performance of the employee
   * @return the response from the service
   */
  public String addEmployeeToDepartment(int departmentId, String name, String hireDate, String position, Double salary, Double performance) {
    UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .path("/addEmpToDept")
      .queryParam("cid", clientId)
      .queryParam("did", departmentId)
      .queryParam("name", name)
      .queryParam("hireDate", hireDate);

    // Add optional parameters only if they are not default
    if (position != null && !position.isEmpty()) {
      uriBuilder.queryParam("position", position);
    }
    if (salary != null && salary != 0) {
      uriBuilder.queryParam("salary", salary);
    }
    if (performance != null && performance != 0) {
      uriBuilder.queryParam("performance", performance);
    }

    String url = uriBuilder.toUriString();
    System.out.println("Constructed URL for Add Employee to Department: " + url);

    String response = webClient.post()
      .uri(uriBuilder.build().toUri())
      .header("Authorization", apiKey)
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }

  /**
   * Calls the service to remove an employee from a department.
   *
   * @param departmentId the department ID
   * @param employeeId the employee ID
   * @return the response from the service
   */
  public String removeEmployeeFromDepartment(int departmentId, int employeeId) {
    UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl)
      .path("/removeEmpFromDept")
      .queryParam("cid", clientId)
      .queryParam("did", departmentId)
      .queryParam("eid", employeeId);

    String url = uriBuilder.toUriString();
    System.out.println("Constructed URL for Remove Employee from Department: " + url);

    String response = webClient.delete()
      .uri(uriBuilder.build().toUri())
      .header("Authorization", apiKey)
      .retrieve()
      .bodyToMono(String.class)
      .block();

    return response;
  }


}