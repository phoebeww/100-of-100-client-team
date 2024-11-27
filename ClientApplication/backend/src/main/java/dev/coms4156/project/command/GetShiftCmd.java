package dev.coms4156.project.command;

import dev.coms4156.project.*;
import java.time.DayOfWeek;
import java.util.*;

public class GetShiftCmd implements Command {
    private final int organizationId;

    public GetShiftCmd(int organizationId) {
        this.organizationId = organizationId;
    }

    @Override
    public Object execute() {
        DatabaseConnection conn = MysqlConnection.getInstance();
        Map<String, Object> response = new HashMap<>();

        // Get all shifts for the organization
        List<ShiftAssignment> allShifts = conn.getShifts(organizationId, null, null);

        // Create a map for each day of the week
        Map<String, List<Map<String, Object>>> scheduleByDay = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            scheduleByDay.put(day.toString(), new ArrayList<>());
        }

        // Sort shifts by day
        for (ShiftAssignment shift : allShifts) {
            Map<String, Object> shiftInfo = new HashMap<>();
            shiftInfo.put("employeeId", shift.getEmployeeId());
            shiftInfo.put("employeeName", shift.getEmployeeName());
            shiftInfo.put("timeSlot", shift.getTimeSlot());
            shiftInfo.put("timeRange", shift.getTimeSlot().getTimeRange());

            String dayKey = shift.getDayOfWeek().toString();
            scheduleByDay.get(dayKey).add(shiftInfo);
        }

        // Sort shifts for each day by time slot
        for (List<Map<String, Object>> dayShifts : scheduleByDay.values()) {
            dayShifts.sort((a, b) -> {
                TimeSlot slotA = (TimeSlot) a.get("timeSlot");
                TimeSlot slotB = (TimeSlot) b.get("timeSlot");
                return slotA.getValue() - slotB.getValue();
            });
        }

        // Find available slots for each day
        Map<String, List<Map<String, Object>>> availableSlots = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            String dayKey = day.toString();
            List<Map<String, Object>> dayShifts = scheduleByDay.get(dayKey);
            Set<TimeSlot> usedSlots = new HashSet<>();

            for (Map<String, Object> shift : dayShifts) {
                usedSlots.add((TimeSlot) shift.get("timeSlot"));
            }

            List<Map<String, Object>> availableSlotsForDay = new ArrayList<>();
            for (TimeSlot slot : TimeSlot.values()) {
                if (!usedSlots.contains(slot)) {
                    Map<String, Object> availableSlot = new HashMap<>();
                    availableSlot.put("timeSlot", slot);
                    availableSlot.put("timeRange", slot.getTimeRange());
                    availableSlotsForDay.add(availableSlot);
                }
            }
            availableSlots.put(dayKey, availableSlotsForDay);
        }

        response.put("status", "success");
        response.put("schedule", scheduleByDay);
        response.put("availableSlots", availableSlots);
        return response;
    }
}