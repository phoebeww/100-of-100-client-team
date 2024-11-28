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

## Running Tests

### Backend Tests
```bash
mvn jacoco:report
```

Test reports can be found in the `target/site/jacoco` directory after running the coverage analysis

## API Documentation

### POST `/login`

- Input

  - `eid` (string): Employee ID
  - `name` (string): Employee name

- Output

  ```
  {
    "status": "success|failed",
    "message": "Success or error message"
  }
  ```

- Status Codes

  - 200: Success
  - 401: Unauthorized
  - 404: Not Found
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



