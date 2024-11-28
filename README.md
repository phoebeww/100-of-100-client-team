# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```


## End-to-End Testing Guide

### System Preparation

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


