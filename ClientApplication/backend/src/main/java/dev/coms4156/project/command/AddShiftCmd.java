package dev.coms4156.project.command;

import dev.coms4156.project.*;
import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AddShiftCmd implements Command {
    private final int organizationId;
    private final int employeeId;
    private final DayOfWeek dayOfWeek;
    private final TimeSlot timeSlot;

    public AddShiftCmd(int organizationId, int employeeId, DayOfWeek dayOfWeek, TimeSlot timeSlot) {
        this.organizationId = organizationId;
        this.employeeId = employeeId;
        this.dayOfWeek = dayOfWeek;
        this.timeSlot = timeSlot;
    }

    @Override
    public Object execute() {
        DatabaseConnection conn = MysqlConnection.getInstance();
        Map<String, Object> response = new HashMap<>();

        // Verify employee exists
        Employee employee = conn.getEmployee(organizationId, employeeId);
        if (employee == null) {
            response.put("status", "failed");
            response.put("message", "Employee not found");
            return response;
        }

        boolean success = conn.assignShift(organizationId, employeeId, dayOfWeek, timeSlot);
        if (success) {
            response.put("status", "success");
            response.put("message", "Shift added successfully");
            response.put("employeeName", employee.getName());
            response.put("dayOfWeek", dayOfWeek.toString());
            response.put("timeSlot", timeSlot.getTimeRange());
        } else {
            response.put("status", "failed");
            response.put("message", "Failed to add shift - time slot might be already assigned");
        }
        return response;
    }
}