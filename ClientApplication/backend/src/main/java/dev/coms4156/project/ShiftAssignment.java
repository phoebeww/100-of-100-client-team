package dev.coms4156.project;

import java.time.DayOfWeek;

public class ShiftAssignment {
    private final int employeeId;      // external employee ID
    private final String employeeName;
    private final DayOfWeek dayOfWeek; // Using Java's DayOfWeek enum
    private final TimeSlot timeSlot;   // Using our TimeSlot enum

    public ShiftAssignment(int employeeId, String employeeName, DayOfWeek dayOfWeek, TimeSlot timeSlot) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.dayOfWeek = dayOfWeek;
        this.timeSlot = timeSlot;
    }

    // Getters
    public int getEmployeeId() {
        return employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }
}