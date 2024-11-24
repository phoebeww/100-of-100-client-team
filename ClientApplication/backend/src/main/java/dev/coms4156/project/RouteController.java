package dev.coms4156.project;

import dev.coms4156.project.command.Command;
import dev.coms4156.project.command.GetOrgInfoCmd;
import dev.coms4156.project.command.RegisterCmd;
import dev.coms4156.project.exception.NotFoundException;
import dev.coms4156.project.utils.CodecUtils;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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