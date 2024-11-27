import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, XCircle } from 'lucide-react';
import ApiService from '../../services/api.ts';
import { ShiftResponse, ShiftInfo, TimeSlotInfo } from '../../types/apiResponses';

interface TimeSlot {
  value: string;
  label: string;
}

interface WeekDay {
  value: string;
  label: string;
}

const timeSlots: TimeSlot[] = [
  { value: "MORNING", label: "09:00-12:00" },
  { value: "AFTERNOON", label: "14:00-17:00" },
  { value: "EVENING", label: "18:00-21:00" }
];

const weekDays: WeekDay[] = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" }
];

const initialShiftState: ShiftResponse = {
  status: '',
  schedule: {},
  availableSlots: {}
};

const ShiftManagementPage: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftResponse>(initialShiftState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
      setError('No client ID found');
      setLoading(false);
      return;
    }

    try {
      const response = await ApiService.getShifts(clientId);
      if (response.status === 200) {
        setShifts(response.data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch shifts');
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotValue = (slotName: string): number => {
    switch (slotName) {
      case "MORNING": return 0;
      case "AFTERNOON": return 1;
      case "EVENING": return 2;
      default: throw new Error("Invalid time slot");
    }
  };
  
  const handleAddShift = async (dayOfWeek: string, timeSlot: string) => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId || !employeeId) {
      setError('Missing client ID or employee ID');
      return;
    }
  
    try {
      const dayIndex = weekDays.findIndex(d => d.value === dayOfWeek) + 1;
      const timeSlotValue = getTimeSlotValue(timeSlot);
      
      const response = await ApiService.addShift(
        clientId, 
        parseInt(employeeId), 
        dayIndex,
        timeSlotValue
      );
      
      if (response.status === 201) {
        fetchShifts();
        setError(null);
      }
    } catch (err) {
      setError('Failed to add shift');
    }
  };

  const handleRemoveShift = async (dayOfWeek: string, timeSlot: string) => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId || !employeeId) {
      setError('Missing client ID or employee ID');
      return;
    }
  
    try {
      const dayIndex = weekDays.findIndex(d => d.value === dayOfWeek) + 1;
      const timeSlotValue = getTimeSlotValue(timeSlot);
      
      const response = await ApiService.removeShift(
        clientId, 
        parseInt(employeeId), 
        dayIndex,
        timeSlotValue
      );
      
      if (response.status === 200) {
        fetchShifts();
        setError(null);
      }
    } catch (err) {
      setError('Failed to remove shift');
    }
  };


  const getShiftForSlot = (day: string, slotValue: string): ShiftInfo | undefined => {
    if (!shifts.schedule[day]) return undefined;
    return shifts.schedule[day].find(shift => shift.timeSlot === slotValue);
  };

  const isSlotAvailable = (day: string, slotValue: string): boolean => {
    if (!shifts.availableSlots[day]) return false;
    return shifts.availableSlots[day].some(slot => slot.timeSlot === slotValue);
  };

  const isMyShift = (shift: ShiftInfo | undefined): boolean => {
    if (!shift || !employeeId) return false;
    return shift.employeeId === parseInt(employeeId);
  };

  if (loading) {
    return <div className="text-center py-4">Loading shifts...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Shift Management</h1>
        <p className="text-gray-500 mt-2">View and manage your weekly shifts</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            <div></div>
            {weekDays.map(day => (
              <div key={day.value} className="text-center font-medium">
                {day.label}
              </div>
            ))}

            {timeSlots.map(slot => (
              <React.Fragment key={slot.value}>
                <div className="text-sm font-medium">{slot.label}</div>
                {weekDays.map(day => {
                  const shift = getShiftForSlot(day.value, slot.value);
                  
                  return (
                    <div key={`${day.value}-${slot.value}`} 
                         className="p-2 border rounded-md min-h-[60px]">
                      {shift ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-700">
                            {shift.employeeName}
                          </div>
                          {isMyShift(shift) && (
                            <button
                              onClick={() => handleRemoveShift(day.value, slot.value)}
                              className="mt-1 text-red-600 hover:text-red-800"
                            >
                              <XCircle className="h-4 w-4 mx-auto" />
                            </button>
                          )}
                        </div>
                      ) : isSlotAvailable(day.value, slot.value) ? (
                        <button
                          onClick={() => handleAddShift(day.value, slot.value)}
                          className="w-full h-full flex items-center justify-center text-green-600 hover:text-green-800"
                        >
                          <PlusCircle className="h-6 w-6" />
                        </button>
                      ) : (
                        <div className="text-xs text-gray-500 text-center">
                          Unavailable
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftManagementPage;