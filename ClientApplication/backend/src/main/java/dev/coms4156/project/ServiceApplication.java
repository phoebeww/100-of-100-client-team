package dev.coms4156.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot application class.
 */
@SpringBootApplication
public class ServiceApplication {

  public static void main(String[] args) {
    // Set the production database connection to be the real MySQL connection
    DatabaseConnection db = MysqlConnection.getInstance();
    HrDatabaseFacade.setConnection(db);

    SpringApplication.run(ServiceApplication.class, args);
  }
}
