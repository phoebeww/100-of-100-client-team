package dev.coms4156.project;

import dev.coms4156.project.command.*;
import dev.coms4156.project.exception.NotFoundException;
import dev.coms4156.project.utils.CodecUtils;
import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * This class contains all the API routes for the system.
 */
@RestController
public class RouteController {

  /**
   * Redirects to the homepage.
   */
  @GetMapping({"/", "/index", "/home"})
  public String index() {
    return "Welcome, in order to make an API call direct your browser or Postman to an endpoint.";
  }

  /**
   * Login as a client by validating the client ID.
   * Notice: No associated command for this method.
   *
   * @param clientId the client ID
   * @return a success message if the client ID is valid,
   *        or throws a 401 exception if the operation fails
   */
  @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> login(
      @RequestParam("cid") String clientId
  ) {
    Map<String, String> response = new HashMap<>();
    try {
      int cid = Integer.parseInt(CodecUtils.decode(clientId));
      Command command = new GetOrgInfoCmd(cid);
      Map<String, Object> orgResponse = (Map<String, Object>) command.execute();
      String orgName = (String) orgResponse.get("name");
      response.put("status", "success");
      response.put("message", "Logged in as " + orgName);
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (NotFoundException | IllegalArgumentException e) {
      response.put("status", "failed");
      response.put("message", "Invalid client ID");
      return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Register a new client, namely to create a new organization.
   *
   * @param name the name of the organization
   * @return a success message and client ID if the organization is successfully created,
   *        or a failure message if the operation fails.
   */
  @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> register(
      @RequestParam("name") String name
  ) {
    Command command = new RegisterCmd(name);
    Map<String, String> response = (Map<String, String>) command.execute();
    if (response.get("status").equals("success")) {
      return new ResponseEntity<>(response, HttpStatus.CREATED);
    } else {
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Adds a recurring shift assignment for an employee.
   *
   * @param clientId the encoded client ID
   * @param employeeId the employee ID
   * @param dayOfWeek the day of week (1-7, Monday to Sunday)
   * @param timeSlot the time slot (0: 9-12, 1: 14-17, 2: 18-21)
   * @return a success message if the shift is assigned, or an error message if the operation fails
   */
  @PostMapping(value = "/addShift", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> addShift(
          @RequestParam("cid") String clientId,
          @RequestParam("employeeId") int employeeId,
          @RequestParam("dayOfWeek") int dayOfWeek,
          @RequestParam("timeSlot") int timeSlot
  ) {
    try {
      int cid = Integer.parseInt(CodecUtils.decode(clientId));
      Command command = new AddShiftCmd(cid, employeeId,
              DayOfWeek.of(dayOfWeek), TimeSlot.fromValue(timeSlot));
      Map<String, Object> response = (Map<String, Object>) command.execute();

      if (response.get("status").equals("success")) {
        return new ResponseEntity<>(response, HttpStatus.CREATED);
      } else {
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
      }
    } catch (NotFoundException | IllegalArgumentException e) {
      Map<String, String> response = new HashMap<>();
      response.put("status", "failed");
      response.put("message", e.getMessage());
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Gets shift assignments, optionally filtered by day or employee.
   *
   * @param clientId the encoded client ID
   * @param dayOfWeek optional: the day of week to filter by (1-7, Monday to Sunday)
   * @param employeeId optional: the employee ID to filter by
   * @return a list of shift assignments
   */
  @GetMapping(value = "/getShift", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> getShift(
          @RequestParam("cid") String clientId,
          @RequestParam(value = "dayOfWeek", required = false) Integer dayOfWeek,
          @RequestParam(value = "employeeId", required = false) Integer employeeId
  ) {
    try {
      int cid = Integer.parseInt(CodecUtils.decode(clientId));
      DayOfWeek day = dayOfWeek != null ? DayOfWeek.of(dayOfWeek) : null;

      Command command = new GetShiftCmd(cid, day, employeeId);
      Map<String, Object> response = (Map<String, Object>) command.execute();
      return new ResponseEntity<>(response, HttpStatus.OK);
    } catch (NotFoundException | IllegalArgumentException e) {
      Map<String, String> response = new HashMap<>();
      response.put("status", "failed");
      response.put("message", e.getMessage());
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Removes a shift assignment.
   *
   * @param clientId the encoded client ID
   * @param employeeId the employee ID
   * @param dayOfWeek the day of week (1-7, Monday to Sunday)
   * @param timeSlot the time slot (0: 9-12, 1: 14-17, 2: 18-21)
   * @return a success message if the shift is removed, or an error message if the operation fails
   */
  @DeleteMapping(value = "/removeShift", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> removeShift(
          @RequestParam("cid") String clientId,
          @RequestParam("employeeId") int employeeId,
          @RequestParam("dayOfWeek") int dayOfWeek,
          @RequestParam("timeSlot") int timeSlot
  ) {
    try {
      int cid = Integer.parseInt(CodecUtils.decode(clientId));
      Command command = new RemoveShiftCmd(cid, employeeId,
              DayOfWeek.of(dayOfWeek), TimeSlot.fromValue(timeSlot));
      Map<String, Object> response = (Map<String, Object>) command.execute();

      if (response.get("status").equals("success")) {
        return new ResponseEntity<>(response, HttpStatus.OK);
      } else {
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
      }
    } catch (NotFoundException | IllegalArgumentException e) {
      Map<String, String> response = new HashMap<>();
      response.put("status", "failed");
      response.put("message", e.getMessage());
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Handles any exceptions that occur in controller.
   *
   * @param e the exception that occurred
   * @return the response entity
   * @deprecated This method is replaced by the global exception handler after 80586a8
   */
  @Deprecated
  private ResponseEntity<?> handleException(Exception e) {
    System.out.println(e.toString());
    return new ResponseEntity<>("An Error has occurred", HttpStatus.INTERNAL_SERVER_ERROR);
  }

}