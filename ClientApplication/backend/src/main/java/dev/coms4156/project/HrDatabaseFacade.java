package dev.coms4156.project;

import dev.coms4156.project.exception.NotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A singleton class of HR database facade.
 * This class is responsible for creating and managing the connection to the HR database.
 * Designed under the Singleton Design Pattern.
 */
public class HrDatabaseFacade {
  private static final Logger logger = LoggerFactory.getLogger(HrDatabaseFacade.class);
  private static final Map<Integer, HrDatabaseFacade> instances = new HashMap<>();
  private static DatabaseConnection dbConnection = null;

  private final int organizationId;
  private List<Employee> employees;
  private List<Department> departments;
  private Organization organization;

  /**
   * Constructs an HR database facade instance for a specific organization.
   *
   * @param organizationId the organization id
   */
  private HrDatabaseFacade(int organizationId) {
    if (dbConnection == null) {
      throw new IllegalStateException("Database connection is not initialized");
    }
    this.organizationId = organizationId;
    // Initialize the in-memory cache
    this.organization = dbConnection.getOrganization(organizationId);
    if (this.organization == null) {
      logger.warn("Organization not found: {}", organizationId);
      throw new NotFoundException("Organization not found");
    }
    this.departments = dbConnection.getDepartments(organizationId);
    this.organization.setDepartments(this.departments);
    this.employees = dbConnection.getEmployees(organizationId);
    this.organization.setEmployees(this.employees);
  }


  /**
   * Returns the organization of the client.
   *
   * @return the organization
   */
  public Organization getOrganization() {
    // Check the in-memory cache (this.organization was initialized in constructor)
    return organization;
  }

  /**
   * Updates the employee information.
   *
   * @param employee the updated employee object
   * @return true if the employee is updated successfully, false otherwise
   */
  public boolean updateEmployee(Employee employee) {
    boolean success = dbConnection.updateEmployee(this.organizationId, employee);
    if (success) {
      // Update organization-level employee cache
      this.employees = dbConnection.getEmployees(this.organizationId);

      // Update department-level employee cache
      for (Department department : this.departments) {
        List<Employee> deptEmployees = department.getEmployees();
        for (int i = 0; i < deptEmployees.size(); i++) {
          Employee deptEmployee = deptEmployees.get(i);
          if (deptEmployee.getId() == employee.getId()) {
            // replace the employee in the department cache
            deptEmployees.set(i, employee);
            break;
          }
        }
      }
    }
    return success;
  }

  // TODO: How to insert(register) / remove(deregister) an organization?

  public static Organization insertOrganization(Organization organization) {
    if (dbConnection == null) {
      throw new IllegalStateException("Database connection is not initialized");
    }
    Organization newOrganization = dbConnection.insertOrganization(organization);
    if (newOrganization != null) {
      // Create a new instance of HrDatabaseFacade for the new organization
      synchronized (HrDatabaseFacade.class) {
        instances.put(newOrganization.getId(), new HrDatabaseFacade(newOrganization.getId()));
      }
    }
    return newOrganization;
  }



  /**
   * Returns the unique instance of the HR database facade for a specific organization.
   * Designed with "double-checked locking" mechanism to ensure thread safety.
   *
   * @param organizationId the organization id
   * @return the HR database facade instance
   */
  public static HrDatabaseFacade getInstance(int organizationId) {
    if (!instances.containsKey(organizationId)) {
      synchronized (HrDatabaseFacade.class) {
        if (!instances.containsKey(organizationId)) {
          instances.put(organizationId, new HrDatabaseFacade(organizationId));
        }
      }
    }
    return instances.get(organizationId);
  }

  /**
   * Sets the database connection for the HR database facade.
   * Notice: This method must be called before any other methods.
   *
   * @param databaseConnection the concrete database connection object
   */
  public static void setConnection(DatabaseConnection databaseConnection) {
    dbConnection = databaseConnection;
    logger.info("Database connection is set to: {}", dbConnection.connectionName());
  }
}
