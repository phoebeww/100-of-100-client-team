package dev.coms4156.project.command;

import dev.coms4156.project.*;
import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GetShiftCmd implements Command {
    private final int organizationId;
    private final DayOfWeek dayOfWeek;
    private final Integer employeeId;

    public GetShiftCmd(int organizationId, DayOfWeek dayOfWeek, Integer employeeId) {
        this.organizationId = organizationId;
        this.dayOfWeek = dayOfWeek;
        this.employeeId = employeeId;
    }

    @Override
    public Object execute() {
        DatabaseConnection conn = MysqlConnection.getInstance();
        Map<String, Object> response = new HashMap<>();

        List<ShiftAssignment> shifts = conn.getShifts(organizationId, dayOfWeek, employeeId);
        response.put("status", "success");
        response.put("shifts", shifts);
        return response;
    }
}
