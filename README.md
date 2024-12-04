# COMS-4156-App
GitHub repository for client of the Team Project associated with COMS 4156 Advanced Software Engineering. Our team name is 100-of-100 and our members are: Yifei Luo, Phoebe Wang, Jiakai Xu and Xintong Yu.

## Viewing the Service Repository
Our service repo link: https://github.com/Alex-XJK/100-of-100-service-team

## About our App

Our app targets **health workers**, providing a comprehensive healthcare management system that enables efficient organization management, employee tracking, and shift scheduling. Through an intuitive interface, health workers can track departments and employee performance, handle budgets, and coordinate work schedules. For admin health workers, they can manage the departments data.

### App Functionality

1. Organization Authentication and Management:
   * Login with employee credentials
   * Register new employees with organization details
   * Organization and department structure management

2. Department Management:
   * View all departments in the organization
   * Track department metrics and statistics
   * Manage department heads and employees
   * Monitor departmental budgets and performance

3. Employee Management:
   * Add/Edit employee information
   * Track employee performance
   * Manage salaries and positions
   * View employee assignments and history

4. Shift Scheduling:
   * Interactive weekly shift calendar
   * Real-time availability checking
   * Easy shift assignment and removal
   * Conflict prevention system
   * Three time slots per day (Morning, Afternoon, Evening)

### How it works with our Service

The system is built with a microservices architecture consisting of two main services:
- Client backend (through API key to connect main service, Port 8081) : Handles authentication and shift management
- Main Service (Port 8080): Track departments and employee performance

When users interact with the frontend interface, requests are routed to the appropriate service through our API layer. The services process these requests, interact with the database, and return the results which are then displayed in the user interface.

### What makes our App Better

Our app offers several advantages:
1. **Integrated Solution**: Combines HR management and shift scheduling in one platform
2. **Real-time Updates**: Immediate feedback on scheduling and management changes
3. **User-Friendly Interface**: Intuitive design making it easy to navigate and use
4. **Conflict Prevention**: Built-in system to prevent scheduling conflicts
5. **Comprehensive Analytics**: Detailed insights into department and employee performance

## Building and Running a Local Instance

### Prerequisites
1. Node.js (Latest LTS version)
2. Java JDK 17
3. Maven 3.9.5
4. MySQL Database
5. VSCode or preferred IDE

### Frontend Setup
1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Access the application at `http://localhost:5173`

### Backend Setup
1. Configure MySQL database
2. Update database credentials in application properties
3. Build and run the services:
   ```bash
   # Client backend (through API key to connect main service, Port 8081)
   mvn spring-boot:run
   
   # Main Service (Port 8080)
   mvn spring-boot:run
   ```

## Deployment on Cloud
The application is deployed using Google Cloud App Engine and can be accessed using the following URLs:

- Application: (https://meal-prep-437118.ue.r.appspot.com/)
  - Access the application.
- Only Backend: (https://coms-4156-client-backend.ue.r.appspot.com/)
  - Use this for backend testing.
- If you need to access just the backend functionality, use the backend URL provided above.

## Running Tests

### Backend Tests
```bash
mvn jacoco:report
```

Test reports can be found in the `target/site/jacoco` directory after running the coverage analysis

### End-to-End Testing Guide

1. Run the Service:

    - Ensure the service portion of the system is running.

    - Please review the build guide on the linked repository [100-of-100-service-team](https://github.com/Alex-XJK/100-of-100-service-team/tree/main)
      for instruction on how to run the service.
    - Confirm the proper configuration for service.url in `ClientApplication/backend/src/resources/application.properties`,
      if local host please use `http://localhost:8080`. If running a cloud based instance of the service, please use the provided IP address.
2. Run the Frontend and Backend of the Application

    - Please open two separate terminals: one for the **frontend** and another for the **backend**.
    - By default, the backend runs on port `8081`. Refer to the build guide in this README for instructions on how to set up and run the backend.
    - The frontend is configured to connect to the backend on port `8081` and should be run in its designated terminal. Ensure the frontend is built and deployed correctly.
3. Access the Login Page
    - You are expected to see the login page with title `HospitalTracker®` displayed.
    - Fields for First Name, Last Name, and Employee ID are visible.
4. Register as a New Employee
    - Action:
        - Click the "Register as Employee" link on the login page.
        - Fill out the form with the following details:
            - First Name: Enter your first name.
            - Last Name: Enter your last name.
            - Department: Select a department from the dropdown.
            - Hire Date: Use a valid date in the format YYYY-MM-DD.
            - Position: Provide a position title (e.g., Nurse or Doctor).
        - Click the Register button.
    - Expected Result:
        - Registration is successful, and the page displays a message: "Registration successful! Your Employee ID is: [ID]".
          Note down the Employee ID for login purposes.
5. Login with Valid Credentials
    - Action:
        - On the login page, enter:
            - First Name: Your registered first name.
            - Last Name: Your registered last name.
            - Employee ID: The ID provided during registration.
        - Click the Login button.
    - Expected Result:
        - You are redirected to the dashboard page. Under title `HospitalTracker®`, you will see `Logged in as [Name] (ID: [ID])`.
6. Navigate Through the Application
    - Action: Explore the available menu options:
        - Dashboard: Displays an overview of the hospital and key metrics.
        - Departments: View a list of all departments and their details.
        - Employees: Access employee details and manage employee information.
        - Shifts: Manage employee weekly shift calendar.
    - Expected Result:
        - Each menu option displays the corresponding page with relevant information.
7. Add an Employee
    - Action:
        - Navigate to the Employees section, click Add Employee.
        - Fill out the form with:
            - Name: Full name.
            - Department: Select a department.
            - Hire Date: Use a valid date.
            - Position: Specify a position.
            - Salary: Enter the salary.
            - Performance: Enter the performance score.
    - Submit the form.
    - Expected Result:
        - The new employee appears in the list with all the entered details.
8. Assign/Delete Shifts to an Employee
    - Action:
        - Navigate to the Shifts section.
        - In the calendar, choose a slot with "+" sign. You will be assigned to the time slot once you click on it.
        - If you want to delete the shift you are assigned on, click on the "x" sign on that time slot.
        - Note: user can only change their own shift time. They cannot make change to other people's shifts.
    - Expected Result:
        - The assigned shift is displayed in the employee's schedule.
9. Edit/Delete an Employee
    - Action:
        - If you want to edit, navigate to the Employees section, select an employee and click Edit.
        - Update details (e.g., change position, performance or salary) and submit the changes.
        - If you want to delete, select an employee click on the delete, confirm with the pop-up window with yes.
    - Expected Result:
        - The employee's updated information is reflected in the list;
        - The employee is successfully deleted (no longer showing in the list).
10. View Department Statistics
    - Action:
        - Navigate to the Dashboard section.
        - Select a department and view its statistics, such as:
            - Position Distribution.
            - Performance Metrics.
            - Budget Statistics.
    - Expected Result:
        - The statistics are displayed accurately with charts and data.
11. Edit Department Details
    - Set Department Head:
        - Choose an employee from the dropdown list and click Set as Head to assign them as the department head. You will see department
          head changes.
    - Add Employee:
        - Fill out the employee's details (First Name, Last Name, Position, Hire Date, Salary, Performance) and click Add Employee to add them to the department.
          You will see the added employee in the department.
    - Edit Employee:
        - Select an employee, modify their details, and click Save Changes to update their information.
    - Delete Employee:
        - Select an employee and click Delete Employee, then confirm the deletion.
12. Log Out
    - Action: Click the Log Out button in the header.
    - Expected Result: You are redirected to the login page.

This is the end of the end-to-end test.

## API Documentation

### POST `/login`
- **Description**: Log in as employee to HospitalTrackers.
- **Input**
  - `eid` (string): Employee ID
  - `name` (string): Employee name
- **Output**
  ```json
  {
    "status": "success|failed",
    "message": "Success or error message"
  }

- **Status Codes**
  - 200: Success
  - 401: Unauthorized
  - 404: Not Found
  - 500: Internal Server Error

### POST `/register`

- **Description**: Registers a new employee within the specified organization.
- **Input**:
    - `firstName` (string): The first name of the employee.
    - `lastName` (string): The last name of the employee.
    - `departmentId` (integer): The ID of the department to which the employee will be added.
    - `hireDate` (string): The hire date of the employee (format: `yyyy-MM-dd`).
    - `position` (string): The position or role of the employee.
- **Output**:
  ```json
  {
    "status": "success|failed",
    "message": "Success or error message"
  }

- **Status Codes**:
  - 201: Created
  - 400: Bad Request
  - 500: Internal Server Error

### POST `/addShift`

- **Description**: Adds a recurring shift assignment for an employee.
- **Input**:
    - `cid` (string): Encoded client ID.
    - `employeeId` (integer): Employee ID.
    - `dayOfWeek` (integer): Day of the week (1–7).
    - `timeSlot` (integer): Time slot (e.g., 0: 9–12, 1: 14–17).
- **Output**:
  ```json
  {
    "status": "success|failed",
    "message": "Success or error message"
  }

- **Status Codes**:
    - 201: Created
    - 400: Bad Request
    - 500: Internal Server Error

### DELETE `/removeShift`

- **Description**: Removes a recurring shift assignment for an employee.

- **Input**:
    - `cid` (string): Encoded client ID.
    - `employeeId` (integer): Employee ID.
    - `dayOfWeek` (integer): Day of the week (1–7, Monday to Sunday).
    - `timeSlot` (integer): Time slot (e.g., 0: 9–12, 1: 14–17, 2: 18–21).

- **Output**:
  ```json
  {
    "status": "success|failed",
    "message": "Success or error message"
  }
  
- **Status Codes**:
    - 200: Success
    - 400: Bad Request
    - 500: Internal Server Error

### GET `/getOrgInfo`

- **Description**: Retrieves organization information for the current client.
- **Input**: None
- **Output**:
  ```json
  {
      "organizationName": "String",
      "departments": [
      {
        "id": "integer",
        "name": "string",
        "employeeCount": "integer"
      }
    ]
  }

- **Status Codes**:
    - 201: Success
    - 400: Bad Request
    - 500: Internal Server Error

### GET `/getDeptInfo`

- **Description**: Retrieves detailed information about a specific department.
- **Input**: `did` (integer): The ID of the department.
- **Output**:
  ```json
  {
  "id": "integer",
  "name": "string",
  "head": "string",
  "headId": "integer",
  "employeeCount": "integer",
  "employees": [
       {
         "id": "integer",
         "name": "string",
         "position": "string",
         "performance": "number",
         "salary": "number"
       }
    ]
  }

- **Status Codes**:
    - 201: Success
    - 400: Bad Request
    - 500: Internal Server Error

### GET `/getEmpInfo`

- **Description**: Retrieves information about a specific employee.
- **Input**: `eid` (integer): The ID of the employee.
- **Output**:
  ```json
  {
  "id": "integer",
  "name": "string",
  "position": "string",
  "performance": "number",
  "salary": "number",
  "department": "string"
  }

- **Status Codes**:
    - 201: Success
    - 400: Bad Request
    - 500: Internal Server Error

### POST `/addEmpToDept`

- **Description**: Adds a new employee to a specific department.
- **Input**:
    - `did` (integer): The department ID.
    - `name` (string): The name of the employee.
    - `hireDate` (string): The hire date of the employee (format: yyyy-MM-dd).
    - `position` (string, optional): The position of the employee.
    - `salary` (double, optional): The salary of the employee.
    - `performance` (double, optional): The performance score of the employee.
- **Output**:
  ```json
  {
    "status": "success|failed",
    "message": "Success or error message"
  }

- **Status Codes**:
    - 201: Created
    - 400: Bad Request
    - 500: Internal Server Error

### DELETE `/removeEmpFromDept`

- **Description**: Removes an employee from a specific department.
- **Input**:
    - `did` (integer): The department ID.
    - `eid` (integer): The employee ID.
- **Output**:
  ```json
  {
    "status": "success|failed",
    "message": "Success or error message"
  }

- **Status Codes**:
    - 200: Success
    - 400: Bad Request
    - 500: Internal Server Error

### PATCH `/setDeptHead`

- **Description**: Sets the head of a department.
- **Input**:
    - `did` (integer): The department ID.
    - `eid` (integer): The employee ID.
- **Output**:
  ```json
  {
    "status": "success|failed",
    "message": "Success or error message"
  }

- **Status Codes**:
    - 200: Success
    - 400: Bad Request
    - 500: Internal Server Error

### PATCH `/updateEmpInfo`

- **Description**: Updates the information of an employee.
- **Input**:
    - `eid` (integer): The employee ID.
    - `position` (string, optional): The position to update.
    - `salary` (double, optional): The salary to update.
    - `performance` (double, optional): The performance score to update.
- **Output**:
  ```json
  {
    "status": "success|failed",
    "message": "Success or error message"
  }

- **Status Codes**:
    - 200: Success
    - 400: Bad Request
    - 500: Internal Server Error

## Development Guide

### Setting Up Development Environment

1. Install Node.js and npm

2. Install Java JDK 17

3. Install Maven

4. Configure IDE (VSCode recommended settings):

   ```
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode"
   }
   ```

### Building a Third-Party Client

1. Obtain API credentials from service
2. Set up authentication flow
3. Implement API calls using service documentation
4. Handle responses and errors appropriately

```
const response = await fetch('http://localhost:8081/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    eid: employeeId,
    name: employeeName
  })
});
```

## Third-Party Libraries

### Frontend Dependencies

- React (18.2.0) - UI Framework
  - Source: `npm install react`
  - Location: `package.json`
- React Router DOM (6.x) - Routing
  - Source: `npm install react-router-dom`
  - Location: `package.json`
- Tailwind CSS (3.x) - Styling
  - Source: `npm install tailwindcss`
  - Location: `package.json`
- Lucide React - Icons
  - Source: `npm install lucide-react`
  - Location: `package.json`
- Recharts - Data Visualization
  - Source: `npm install recharts`
  - Location: `package.json`
- shadcn/ui - UI Components
  - Source: Custom implementation
  - Location: `components/ui/`

### Backend Dependencies

- Spring Boot (3.1.5)
  - Source: Maven Central
  - Location: `pom.xml`
- MySQL Connector (8.0.x)
  - Source: Maven Central
  - Location: `pom.xml`
- JUnit (5.9.3)
  - Source: Maven Central
  - Location: `pom.xml`


