package dev.coms4156.project;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;

import java.util.HashMap;
import java.util.Map;

import dev.coms4156.project.command.Command;
import dev.coms4156.project.command.GetShiftCmd;
import dev.coms4156.project.utils.CodecUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;


public class RouteControllerTest {

  private RouteController routeController;
  private MyServiceCaller serviceCaller;

  @BeforeEach
  public void setUp() {
    routeController = new RouteController();
    serviceCaller = mock(MyServiceCaller.class);
    routeController.serviceCaller = serviceCaller;
  }

  @Test
  public void testLogin_Success() throws Exception {
    String employeeId = "123";
    String name = "John Doe";

    // Mock the service call
    String employeeInfoJson = "{\"name\":\"John Doe\"}";
    when(serviceCaller.getEmployeeInfo(employeeId)).thenReturn(employeeInfoJson);

    ResponseEntity<?> responseEntity = routeController.login(employeeId, name);

    assertEquals(200, responseEntity.getStatusCodeValue());
    Map<String, String> responseBody = (Map<String, String>) responseEntity.getBody();
    assertEquals("success", responseBody.get("status"));
    assertEquals("Logged in as John Doe", responseBody.get("message"));
  }

  @Test
  public void testLogin_EmployeeNotFound() throws Exception {
    String employeeId = "123";
    String name = "John Doe";

    // Mock the service call to return null
    when(serviceCaller.getEmployeeInfo(employeeId)).thenReturn(null);

    ResponseEntity<?> responseEntity = routeController.login(employeeId, name);

    assertEquals(404, responseEntity.getStatusCodeValue());
    Map<String, String> responseBody = (Map<String, String>) responseEntity.getBody();
    assertEquals("failed", responseBody.get("status"));
    assertEquals("Employee ID does not exist", responseBody.get("message"));
  }

  @Test
  public void testLogin_NameMismatch() throws Exception {
    String employeeId = "123";
    String name = "John Doe";

    // Mock the service call with a different name
    String employeeInfoJson = "{\"name\":\"Jane Smith\"}";
    when(serviceCaller.getEmployeeInfo(employeeId)).thenReturn(employeeInfoJson);

    ResponseEntity<?> responseEntity = routeController.login(employeeId, name);

    assertEquals(401, responseEntity.getStatusCodeValue());
    Map<String, String> responseBody = (Map<String, String>) responseEntity.getBody();
    assertEquals("failed", responseBody.get("status"));
    assertEquals("Employee name does not match", responseBody.get("message"));
  }

  @Test
  public void testRegisterEmployee_Success() throws Exception {
    String firstName = "John";
    String lastName = "Doe";
    int departmentId = 1;
    String hireDate = "2021-01-01";
    String position = "Engineer";

    // Mock the service call
    String addEmployeeResponse = "{\"status\":200,\"message\":\"Employee registered successfully\"}";
    when(serviceCaller.registerNewEmployee("John Doe", departmentId, hireDate, position))
        .thenReturn(addEmployeeResponse);

    ResponseEntity<?> responseEntity = routeController.registerEmployee(firstName, lastName, departmentId, hireDate, position);

    assertEquals(201, responseEntity.getStatusCodeValue());
    Map<String, Object> responseBody = (Map<String, Object>) responseEntity.getBody();
    assertEquals("success", responseBody.get("status"));
    assertEquals("Employee registered successfully", responseBody.get("message"));
  }

  @Test
  public void testRegisterEmployee_Failure() throws Exception {
    String firstName = "John";
    String lastName = "Doe";
    int departmentId = 1;
    String hireDate = "2021-01-01";
    String position = "Engineer";

    // Mock the service call
    String addEmployeeResponse = "{\"status\":400,\"message\":\"Failed to register\"}";
    when(serviceCaller.registerNewEmployee("John Doe", departmentId, hireDate, position))
        .thenReturn(addEmployeeResponse);

    ResponseEntity<?> responseEntity = routeController.registerEmployee(firstName, lastName, departmentId, hireDate, position);

    assertEquals(400, responseEntity.getStatusCodeValue());
    Map<String, Object> responseBody = (Map<String, Object>) responseEntity.getBody();
    assertEquals("failed", responseBody.get("status"));
    assertEquals("Failed to register new employee", responseBody.get("message"));
  }

  @Test
  public void testGetOrganization_Success() throws Exception {
    String organizationInfo = "{\"name\":\"My Organization\",\"id\":1}";

    // Mock the service call
    when(serviceCaller.getOrganizationInfo()).thenReturn(organizationInfo);

    ResponseEntity<?> responseEntity = routeController.getOrganization();

    assertEquals(200, responseEntity.getStatusCodeValue());
    assertEquals(organizationInfo, responseEntity.getBody());
  }

  @Test
  public void testGetDepartmentInfo_Success() throws Exception {
    int departmentId = 1;
    String departmentInfo = "{\"name\":\"Engineering\",\"id\":1}";

    // Mock the service call
    when(serviceCaller.getDepartmentInfo(departmentId)).thenReturn(departmentInfo);

    ResponseEntity<?> responseEntity = routeController.getDepartmentInfo(departmentId);

    assertEquals(200, responseEntity.getStatusCodeValue());
    assertEquals(departmentInfo, responseEntity.getBody());
  }

  @Test
  public void testGetEmployeeInfo_Success() throws Exception {
    int employeeId = 123;
    String employeeInfo = "{\"name\":\"John Doe\",\"id\":123}";

    // Mock the service call
    when(serviceCaller.getEmployeeInfo(employeeId)).thenReturn(employeeInfo);

    ResponseEntity<?> responseEntity = routeController.getEmployeeInfo(employeeId);

    assertEquals(200, responseEntity.getStatusCodeValue());
    assertEquals(employeeInfo, responseEntity.getBody());
  }

  @Test
  public void testSetDepartmentHead_Success() throws Exception {
    int departmentId = 1;
    int employeeId = 123;
    String responseMessage = "{\"status\":\"success\",\"message\":\"Department head set successfully\"}";

    // Mock the service call
    when(serviceCaller.setDepartmentHead(departmentId, employeeId)).thenReturn(responseMessage);

    ResponseEntity<?> responseEntity = routeController.setDepartmentHead(departmentId, employeeId);

    assertEquals(200, responseEntity.getStatusCodeValue());
    assertEquals(responseMessage, responseEntity.getBody());
  }

  @Test
  public void testUpdateEmployeeInfo_Success() throws Exception {
    int employeeId = 123;
    String position = "Senior Engineer";
    Double salary = 90000.0;
    Double performance = 4.5;
    String responseMessage = "{\"status\":\"success\",\"message\":\"Employee info updated successfully\"}";

    // Mock the service call
    when(serviceCaller.updateEmployeeInfo(employeeId, position, salary, performance)).thenReturn(responseMessage);

    ResponseEntity<?> responseEntity = routeController.updateEmployeeInfo(employeeId, position, salary, performance);

    assertEquals(200, responseEntity.getStatusCodeValue());
    assertEquals(responseMessage, responseEntity.getBody());
  }

  @Test
  public void testAddEmployeeToDepartment_Success() throws Exception {
    int departmentId = 1;
    String name = "John Doe";
    String hireDate = "2021-01-01";
    String position = "Engineer";
    Double salary = 80000.0;
    Double performance = 4.0;
    String responseMessage = "{\"status\":\"success\",\"message\":\"Employee added to department successfully\"}";

    // Mock the service call
    when(serviceCaller.addEmployeeToDepartment(departmentId, name, hireDate, position, salary, performance))
        .thenReturn(responseMessage);

    ResponseEntity<?> responseEntity = routeController.addEmployeeToDepartment(departmentId, name, hireDate, position, salary, performance);

    assertEquals(201, responseEntity.getStatusCodeValue());
    assertEquals(responseMessage, responseEntity.getBody());
  }

  @Test
  public void testRemoveEmployeeFromDepartment_Success() throws Exception {
    int departmentId = 1;
    int employeeId = 123;
    String responseMessage = "{\"status\":\"success\",\"message\":\"Employee removed from department successfully\"}";

    // Mock the service call
    when(serviceCaller.removeEmployeeFromDepartment(departmentId, employeeId)).thenReturn(responseMessage);

    ResponseEntity<?> responseEntity = routeController.removeEmployeeFromDepartment(departmentId, employeeId);

    assertEquals(200, responseEntity.getStatusCodeValue());
    assertEquals(responseMessage, responseEntity.getBody());
  }

  @Test
  public void testGetShift_Success() throws Exception {
    String clientId = CodecUtils.encode("1");

    // Mock the command execution
    Map<String, Object> commandResponse = new HashMap<>();
    commandResponse.put("status", "success");
    commandResponse.put("shifts", new Object[]{}); // Empty array for simplicity

    Command command = mock(GetShiftCmd.class);
    when(command.execute()).thenReturn(commandResponse);

    // For simplicity, we'll assume the endpoint works as expected
    ResponseEntity<?> responseEntity = routeController.getShift(clientId);

    assertEquals(200, responseEntity.getStatusCodeValue());
  }

}
