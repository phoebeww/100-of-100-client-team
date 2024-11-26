package dev.coms4156.project;

/**
 * Represents fixed time slots for employee shifts.
 */
public enum TimeSlot {
    MORNING(0, "09:00-12:00"),
    AFTERNOON(1, "14:00-17:00"),
    EVENING(2, "18:00-21:00");

    private final int value;
    private final String timeRange;

    TimeSlot(int value, String timeRange) {
        this.value = value;
        this.timeRange = timeRange;
    }

    public int getValue() {
        return value;
    }

    public String getTimeRange() {
        return timeRange;
    }

    public static TimeSlot fromValue(int value) {
        for (TimeSlot slot : TimeSlot.values()) {
            if (slot.value == value) {
                return slot;
            }
        }
        throw new IllegalArgumentException("Invalid time slot value: " + value);
    }
}