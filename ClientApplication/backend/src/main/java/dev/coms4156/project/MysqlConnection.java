package dev.coms4156.project;

import dev.coms4156.project.exception.InternalServerErrorException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.time.DayOfWeek;

/**
 * A singleton class of database connection.
 * This class is responsible for creating and managing the connection to the database.
 * Designed under the Singleton Design Pattern.
 */
public class MysqlConnection implements DatabaseConnection {
  private static volatile MysqlConnection instance;
  private Connection connection;

  @Override
  public String connectionName() {
    return "MysqlConnection::us-east-1.rds.amazonaws.com";
  }

  private MysqlConnection() {
    try {
      String url = "jdbc:mysql://new-db.c3uqsummqbeu.us-east-1.rds.amazonaws.com:3306/"
              + "organization_management";
      String user = "admin";
      String password = "12345678";
      this.connection = DriverManager.getConnection(url, user, password);
    } catch (SQLException e) {
      e.printStackTrace();
      throw new InternalServerErrorException("Failed to connect to the database.");
    }
  }

  /**
   * Returns an employee in a given organization by external ID.
   *
   * @param organizationId the organization id (clientId)
   * @param externalEmployeeId the external employee id
   * @return the employee if found, null otherwise
   */
  @Override
  public Employee getEmployee(int organizationId, int externalEmployeeId) {
    int internalEmployeeId = organizationId * 10000 + externalEmployeeId;
    String query = "SELECT * FROM employees WHERE organization_id = ? AND employee_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setInt(1, organizationId);
      pstmt.setInt(2, internalEmployeeId);
      ResultSet rs = pstmt.executeQuery();
      if (rs.next()) {
        Employee employee = new Employee(
                externalEmployeeId,
                rs.getString("name"),
                rs.getDate("hire_date")
        );
        // Set additional employee information
        employee.setPosition(rs.getString("position"));
        employee.setSalary(rs.getDouble("salary"));
        employee.setPerformance(rs.getDouble("performance"));
        return employee;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * Returns a department in a given organization by external ID.
   *
   * @param organizationId the organization id (clientId)
   * @param externalDepartmentId the external department id
   * @return the department if found, null otherwise
   */
  @Override
  public Department getDepartment(int organizationId, int externalDepartmentId) {
    int internalDepartmentId = organizationId * 10000 + externalDepartmentId;
    String query = "SELECT * FROM departments WHERE organization_id = ? AND department_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setInt(1, organizationId);
      pstmt.setInt(2, internalDepartmentId);
      ResultSet rs = pstmt.executeQuery();
      if (rs.next()) {
        List<Employee> employees = getEmployeesForDepartment(internalDepartmentId, organizationId);
        return new Department(
                externalDepartmentId,
                rs.getString("name"),
                employees
        );
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * Returns a list of employees in a given organization.
   *
   * @param organizationId the organization id
   * @return a list of employees in the organization
   */
  @Override
  public List<Employee> getEmployees(int organizationId) {
    List<Employee> employees = new ArrayList<>();
    String query = "SELECT * FROM employees WHERE organization_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setInt(1, organizationId);
      ResultSet rs = pstmt.executeQuery();
      while (rs.next()) {
        int internalId = rs.getInt("employee_id");
        int externalId = internalId % 10000;
        Employee employee = new Employee(
                externalId,
                rs.getString("name"),
                rs.getDate("hire_date")
        );
        // Set additional employee information
        employee.setPosition(rs.getString("position"));
        employee.setSalary(rs.getDouble("salary"));
        employee.setPerformance(rs.getDouble("performance"));
        employees.add(employee);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return employees;
  }

  /**
   * Returns a list of departments in a given organization.
   *
   * @param organizationId the organization id
   * @return a list of departments in the organization
   */
  @Override
  public List<Department> getDepartments(int organizationId) {
    List<Department> departments = new ArrayList<>();
    String query = "SELECT * FROM departments WHERE organization_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setInt(1, organizationId);
      ResultSet rs = pstmt.executeQuery();
      while (rs.next()) {
        int internalId = rs.getInt("department_id");
        int externalId = internalId % 10000;
        List<Employee> employees = getEmployeesForDepartment(internalId, organizationId);
        Department department = new Department(
                externalId,
                rs.getString("name"),
                employees
        );

        // Get and set head if exists
        Integer headEmployeeId = rs.getInt("head_employee_id");
        if (!rs.wasNull()) {
          Employee head = getEmployee(organizationId, headEmployeeId % 10000);
          if (head != null) {
            department.setHead(head);
          }
        }

        departments.add(department);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return departments;
  }

  /**
   * Returns an organization with the given organization id.
   *
   * @param organizationId the organization id
   * @return the organization with the given organization id
   */
  @Override
  public Organization getOrganization(int organizationId) {
    String query = "SELECT * FROM organizations WHERE organization_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setInt(1, organizationId);
      ResultSet rs = pstmt.executeQuery();
      if (rs.next()) {
        return new Organization(
                rs.getInt("organization_id"),
                rs.getString("name")
        );
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  /**
   * Returns a list of employees in a given department.
   *
   * @param internalDepartmentId the internal department id
   * @param organizationId the organization id
   * @return a list of employees in the department
   */
  private List<Employee> getEmployeesForDepartment(int internalDepartmentId, int organizationId) {
    List<Employee> employees = new ArrayList<>();
    String query = "SELECT * FROM employees WHERE department_id = ? AND organization_id = ?";

    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setInt(1, internalDepartmentId);
      pstmt.setInt(2, organizationId);
      ResultSet rs = pstmt.executeQuery();

      while (rs.next()) {
        int internalId = rs.getInt("employee_id");
        int externalId = internalId % 10000;
        Employee employee = new Employee(
                externalId,
                rs.getString("name"),
                rs.getDate("hire_date")
        );
        // Set additional employee information
        employee.setPosition(rs.getString("position"));
        employee.setSalary(rs.getDouble("salary"));
        employee.setPerformance(rs.getDouble("performance"));
        employees.add(employee);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }

    return employees;
  }

  /**
   * Adds a new employee to a department in the database.
   *
   * @param organizationId the organization id
   * @param departmentId the internal department id
   * @param employee the employee to add
   * @return the internal employee ID if successful, -1 if failed
   */
  @Override
  public int addEmployeeToDepartment(int organizationId, int departmentId, Employee employee) {
    // First get the next available employee ID for this organization
    String maxIdQuery =
            "SELECT MAX(employee_id) as max_id "
                    + "FROM employees "
                    + "WHERE organization_id = ?";
    int newEmployeeId;

    try (PreparedStatement pstmt = connection.prepareStatement(maxIdQuery)) {
      pstmt.setInt(1, organizationId);
      ResultSet rs = pstmt.executeQuery();
      if (rs.next()) {
        int maxId = rs.getInt("max_id");
        if (rs.wasNull()) {
          newEmployeeId = organizationId * 10000 + 1;
        } else {
          newEmployeeId = maxId + 1;
        }
      } else {
        newEmployeeId = organizationId * 10000 + 1;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return -1;
    }

    // Insert the new employee
    String insertEmployeeQuery =
      "INSERT INTO employees "
        + "(employee_id, organization_id, department_id, name, hire_date, position, salary, performance) "
        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    try (PreparedStatement pstmt = connection.prepareStatement(insertEmployeeQuery)) {
      pstmt.setInt(1, newEmployeeId);
      pstmt.setInt(2, organizationId);
      pstmt.setInt(3, departmentId);
      pstmt.setString(4, employee.getName());
      pstmt.setDate(5, new java.sql.Date(employee.getHireDate().getTime()));
      pstmt.setString(6, employee.getPosition());
      pstmt.setDouble(7, employee.getSalary());
      pstmt.setDouble(8, employee.getPerformance());

      int rowsAffected = pstmt.executeUpdate();
      if (rowsAffected > 0) {
        return newEmployeeId;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return -1;
  }

  /**
   * Removes an employee from a department in the database.
   *
   * @param organizationId the organization id
   * @param departmentId the internal department id
   * @param employeeId the internal employee id
   * @return true if removal successful, false otherwise
   */
  @Override
  public boolean removeEmployeeFromDepartment(int organizationId,
                                              int departmentId, int employeeId) {
    String checkHeadQuery =
            "SELECT head_employee_id FROM departments "
                    + "WHERE department_id = ? AND organization_id = ?";

    try (PreparedStatement checkStmt = connection.prepareStatement(checkHeadQuery)) {
      checkStmt.setInt(1, departmentId);
      checkStmt.setInt(2, organizationId);

      ResultSet rs = checkStmt.executeQuery();
      if (rs.next() && rs.getInt("head_employee_id") == employeeId) {
        String updateHeadQuery =
                "UPDATE departments SET head_employee_id = NULL "
                        + "WHERE department_id = ? AND organization_id = ?";
        try (PreparedStatement updateStmt = connection.prepareStatement(updateHeadQuery)) {
          updateStmt.setInt(1, departmentId);
          updateStmt.setInt(2, organizationId);
          updateStmt.executeUpdate();
        }
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }

    String deleteQuery =
            "DELETE FROM employees "
                    + "WHERE employee_id = ? AND department_id = ? AND organization_id = ?";

    try (PreparedStatement pstmt = connection.prepareStatement(deleteQuery)) {
      pstmt.setInt(1, employeeId);
      pstmt.setInt(2, departmentId);
      pstmt.setInt(3, organizationId);

      int rowsAffected = pstmt.executeUpdate();
      return rowsAffected > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  @Override
  public boolean updateEmployee(int organizationId, Employee employee) {
    int internalEmployeeId = organizationId * 10000 + employee.getId();
    String query = "UPDATE employees SET name = ?, position = ?, salary = ?, performance = ? "
            + "WHERE organization_id = ? AND employee_id = ?";

    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setString(1, employee.getName());
      pstmt.setString(2, employee.getPosition());
      pstmt.setDouble(3, employee.getSalary());
      pstmt.setDouble(4, employee.getPerformance());
      pstmt.setInt(5, organizationId);
      pstmt.setInt(6, internalEmployeeId);

      int rowsAffected = pstmt.executeUpdate();
      return rowsAffected > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }


  /**
   * Updates a department's information in the database.
   * This method handles all department updates including setting department head.
   *
   * @param organizationId the organization id
   * @param department the department to update
   * @return true if update successful, false otherwise
   */
  @Override
  public boolean updateDepartment(int organizationId, Department department) {
    int internalDepartmentId = organizationId * 10000 + department.getId();
    Employee head = department.getHead();
    int headEmployeeId = head != null ? (organizationId * 10000 + head.getId()) : 0;

    if (head != null) {
      String verifyQuery =
              "SELECT 1 FROM employees "
                      + "WHERE employee_id = ? AND organization_id = ? AND department_id = ?";

      try (PreparedStatement verifyStmt = connection.prepareStatement(verifyQuery)) {
        verifyStmt.setInt(1, headEmployeeId);
        verifyStmt.setInt(2, organizationId);
        verifyStmt.setInt(3, internalDepartmentId);

        if (!verifyStmt.executeQuery().next()) {
          return false;
        }
      } catch (SQLException e) {
        e.printStackTrace();
        return false;
      }
    }

    String query = "UPDATE departments SET name = ?, head_employee_id = ? "
            + "WHERE organization_id = ? AND department_id = ?";

    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setString(1, department.getName());
      if (head != null) {
        pstmt.setInt(2, headEmployeeId);
      } else {
        pstmt.setNull(2, java.sql.Types.INTEGER);
      }
      pstmt.setInt(3, organizationId);
      pstmt.setInt(4, internalDepartmentId);

      int rowsAffected = pstmt.executeUpdate();
      return rowsAffected > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  @Override
  public boolean updateOrganization(Organization organization) {
    String query = "UPDATE organizations SET name = ? WHERE organization_id = ?";

    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setString(1, organization.getName());
      pstmt.setInt(2, organization.getId());

      int rowsAffected = pstmt.executeUpdate();
      return rowsAffected > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  @Override
  public Department insertDepartment(int organizationId, Department department) {
    // Generate a new internal department ID
    String maxIdQuery = "SELECT MAX(department_id) as max_id FROM departments WHERE organization_id = ?";
    int newDepartmentId;

    try (PreparedStatement pstmt = connection.prepareStatement(maxIdQuery)) {
      pstmt.setInt(1, organizationId);
      ResultSet rs = pstmt.executeQuery();
      if (rs.next()) {
        int maxId = rs.getInt("max_id");
        if (rs.wasNull()) {
          newDepartmentId = organizationId * 10000 + 1;
        } else {
          newDepartmentId = maxId + 1;
        }
      } else {
        newDepartmentId = organizationId * 10000 + 1;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    }

    String insertDepartmentQuery = "INSERT INTO departments (department_id, organization_id, name) VALUES (?, ?, ?)";

    try (PreparedStatement pstmt = connection.prepareStatement(insertDepartmentQuery)) {
      pstmt.setInt(1, newDepartmentId);
      pstmt.setInt(2, organizationId);
      pstmt.setString(3, department.getName());

      int rowsAffected = pstmt.executeUpdate();
      if (rowsAffected > 0) {
        int externalDeptId = newDepartmentId % 10000;
        Department newDept = new Department(externalDeptId, department.getName(), new ArrayList<>());
        return newDept;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  @Override
  public boolean removeDepartment(int organizationId, int externalDepartmentId) {
    int internalDepartmentId = organizationId * 10000 + externalDepartmentId;

    // First, remove all employees in the department
    String deleteEmployeesQuery = "DELETE FROM employees WHERE organization_id = ? AND department_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(deleteEmployeesQuery)) {
      pstmt.setInt(1, organizationId);
      pstmt.setInt(2, internalDepartmentId);
      pstmt.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }

    // Then, remove the department
    String deleteDepartmentQuery = "DELETE FROM departments WHERE organization_id = ? AND department_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(deleteDepartmentQuery)) {
      pstmt.setInt(1, organizationId);
      pstmt.setInt(2, internalDepartmentId);

      int rowsAffected = pstmt.executeUpdate();
      return rowsAffected > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  @Override
  public Organization insertOrganization(Organization organization) {
    // Generate a new organization ID
    String maxIdQuery = "SELECT MAX(organization_id) as max_id FROM organizations";
    int newOrganizationId;

    try (PreparedStatement pstmt = connection.prepareStatement(maxIdQuery)) {
      ResultSet rs = pstmt.executeQuery();
      if (rs.next()) {
        int maxId = rs.getInt("max_id");
        if (rs.wasNull()) {
          newOrganizationId = 1;
        } else {
          newOrganizationId = maxId + 1;
        }
      } else {
        newOrganizationId = 1;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    }

    String insertOrganizationQuery = "INSERT INTO organizations (organization_id, name) VALUES (?, ?)";

    try (PreparedStatement pstmt = connection.prepareStatement(insertOrganizationQuery)) {
      pstmt.setInt(1, newOrganizationId);
      pstmt.setString(2, organization.getName());

      int rowsAffected = pstmt.executeUpdate();
      if (rowsAffected > 0) {
        Organization newOrg = new Organization(newOrganizationId, organization.getName());
        return newOrg;
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  @Override
  public boolean removeOrganization(int organizationId) {
    // Delete employees
    String deleteEmployeesQuery = "DELETE FROM employees WHERE organization_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(deleteEmployeesQuery)) {
      pstmt.setInt(1, organizationId);
      pstmt.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }

    String deleteDepartmentsQuery = "DELETE FROM departments WHERE organization_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(deleteDepartmentsQuery)) {
      pstmt.setInt(1, organizationId);
      pstmt.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }

    String deleteOrganizationQuery = "DELETE FROM organizations WHERE organization_id = ?";
    try (PreparedStatement pstmt = connection.prepareStatement(deleteOrganizationQuery)) {
      pstmt.setInt(1, organizationId);

      int rowsAffected = pstmt.executeUpdate();
      return rowsAffected > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }


  /**
   * Returns the unique instance of the database connection.
   * Designed with "double-checked locking" mechanism to ensure thread safety.
   *
   * @return the database connection instance
   */
  public static MysqlConnection getInstance() {
    if (instance == null) {
      synchronized (MysqlConnection.class) {
        if (instance == null) {
          instance = new MysqlConnection();
        }
      }
    }
    return instance;
  }
  @Override
  public boolean assignShift(int organizationId, int employeeId, DayOfWeek dayOfWeek, TimeSlot timeSlot) {
    int internalEmployeeId = organizationId * 10000 + employeeId;
    String query = "INSERT INTO shifts (organization_id, employee_id, day_of_week, time_slot) "
            + "VALUES (?, ?, ?, ?)";

    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setInt(1, organizationId);
      pstmt.setInt(2, internalEmployeeId);
      pstmt.setInt(3, dayOfWeek.getValue());  // DayOfWeek.getValue() returns 1 (Monday) through 7 (Sunday)
      pstmt.setInt(4, timeSlot.getValue());   // TimeSlot.getValue() returns 0, 1, or 2

      int rowsAffected = pstmt.executeUpdate();
      return rowsAffected > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  @Override
  public List<ShiftAssignment> getShifts(int organizationId, DayOfWeek dayOfWeek, Integer employeeId) {
    List<ShiftAssignment> shifts = new ArrayList<>();
    StringBuilder query = new StringBuilder(
            "SELECT s.*, e.name as employee_name "
                    + "FROM shifts s "
                    + "JOIN employees e ON s.employee_id = e.employee_id "
                    + "WHERE s.organization_id = ?"
    );

    if (dayOfWeek != null) {
      query.append(" AND s.day_of_week = ?");
    }
    if (employeeId != null) {
      query.append(" AND s.employee_id = ?");
    }

    try (PreparedStatement pstmt = connection.prepareStatement(query.toString())) {
      int paramIndex = 1;
      pstmt.setInt(paramIndex++, organizationId);

      if (dayOfWeek != null) {
        pstmt.setInt(paramIndex++, dayOfWeek.getValue());
      }
      if (employeeId != null) {
        pstmt.setInt(paramIndex, organizationId * 10000 + employeeId);
      }

      ResultSet rs = pstmt.executeQuery();
      while (rs.next()) {
        ShiftAssignment shift = new ShiftAssignment(
                rs.getInt("employee_id") % 10000,
                rs.getString("employee_name"),
                DayOfWeek.of(rs.getInt("day_of_week")),
                TimeSlot.fromValue(rs.getInt("time_slot"))
        );
        shifts.add(shift);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return shifts;
  }

  @Override
  public boolean removeShift(int organizationId, int employeeId, DayOfWeek dayOfWeek, TimeSlot timeSlot) {
    int internalEmployeeId = organizationId * 10000 + employeeId;
    String query = "DELETE FROM shifts "
            + "WHERE organization_id = ? AND employee_id = ? AND day_of_week = ? AND time_slot = ?";

    try (PreparedStatement pstmt = connection.prepareStatement(query)) {
      pstmt.setInt(1, organizationId);
      pstmt.setInt(2, internalEmployeeId);
      pstmt.setInt(3, dayOfWeek.getValue());
      pstmt.setInt(4, timeSlot.getValue());

      int rowsAffected = pstmt.executeUpdate();
      return rowsAffected > 0;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }
}
