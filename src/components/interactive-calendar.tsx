import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Appointment } from "@shared/schema";

interface InteractiveCalendarProps {
  onDateSelect?: (date: string) => void;
  onTimeSelect?: (time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

export default function InteractiveCalendar({ 
  onDateSelect, 
  onTimeSelect, 
  selectedDate,
  selectedTime 
}: InteractiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(selectedDate || format(new Date(), "yyyy-MM-dd"));

  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: availableTimes = [], isLoading: loadingTimes } = useQuery({
    queryKey: ["/api/appointments/available", viewDate],
    enabled: !!viewDate,
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments.filter((apt: Appointment) => 
      apt.date === dateStr && apt.status !== "canceled"
    );
  };

  const getDayStatus = (date: Date) => {
    const dayAppointments = getAppointmentsForDate(date);
    if (dayAppointments.length === 0) return "available";
    
    const hasPending = dayAppointments.some((apt: Appointment) => apt.status === "pending");
    const hasConfirmed = dayAppointments.some((apt: Appointment) => apt.status === "confirmed");
    
    if (hasPending && hasConfirmed) return "mixed";
    if (hasPending) return "pending";
    if (hasConfirmed) return "booked";
    return "available";
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    const dateStr = format(date, "yyyy-MM-dd");
    setViewDate(dateStr);
    if (onDateSelect) {
      onDateSelect(dateStr);
    }
  };

  const handleTimeClick = (time: string) => {
    if (onTimeSelect) {
      onTimeSelect(time);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const allTimeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const getTimeSlotStatus = (time: string) => {
    const viewDateAppointments = appointments.filter((apt: Appointment) => 
      apt.date === viewDate && apt.status !== "canceled"
    );
    
    const isBooked = viewDateAppointments.some((apt: Appointment) => apt.time === time);
    const isAvailable = availableTimes.includes(time);
    
    if (isBooked) return "booked";
    if (isAvailable) return "available";
    return "unavailable";
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card className="shadow-sm border border-neutral-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">
                {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-sm font-medium text-neutral-600 p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center">
            {days.map((day) => {
              const dayStatus = getDayStatus(day);
              const appointmentCount = getAppointmentsForDate(day).length;
              const isDisabled = isDateDisabled(day);
              const isSelected = viewDate === format(day, "yyyy-MM-dd");
              
              return (
                <Button
                  key={day.toISOString()}
                  variant="ghost"
                  className={`
                    h-12 p-2 text-sm relative transition-all duration-200
                    ${!isSameMonth(day, currentDate) ? "text-neutral-400" : ""}
                    ${isToday(day) ? "bg-primary text-white font-bold hover:bg-blue-700" : ""}
                    ${isSelected && !isToday(day) ? "bg-blue-100 text-primary border-2 border-primary" : ""}
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
                  `}
                  onClick={() => handleDateClick(day)}
                  disabled={isDisabled}
                >
                  {format(day, "d")}
                  {appointmentCount > 0 && (
                    <div 
                      className={`
                        w-2 h-2 rounded-full absolute bottom-1 right-1
                        ${dayStatus === "pending" ? "bg-accent" : ""}
                        ${dayStatus === "booked" ? "bg-secondary" : ""}
                        ${dayStatus === "mixed" ? "bg-gradient-to-r from-accent to-secondary" : ""}
                      `}
                      title={`${appointmentCount} agendamento(s)`}
                    />
                  )}
                </Button>
              );
            })}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-secondary rounded-full mr-2" />
              <span className="text-neutral-600">Confirmado</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-accent rounded-full mr-2" />
              <span className="text-neutral-600">Pendente</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-accent to-secondary rounded-full mr-2" />
              <span className="text-neutral-600">Misto</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      {viewDate && (
        <Card className="shadow-sm border border-neutral-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">
                Horários para {format(new Date(viewDate), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTimes ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-neutral-600 mt-2">Carregando horários...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {allTimeSlots.map((time) => {
                    const status = getTimeSlotStatus(time);
                    const isSelected = selectedTime === time;
                    
                    return (
                      <Button
                        key={time}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={`
                          transition-all duration-200
                          ${status === "available" ? "border-green-300 text-green-700 hover:bg-green-50" : ""}
                          ${status === "booked" ? "border-red-300 text-red-700 bg-red-50 cursor-not-allowed" : ""}
                          ${status === "unavailable" ? "border-neutral-300 text-neutral-500 bg-neutral-50 cursor-not-allowed" : ""}
                          ${isSelected ? "bg-primary text-white border-primary" : ""}
                        `}
                        onClick={() => status === "available" ? handleTimeClick(time) : undefined}
                        disabled={status !== "available"}
                      >
                        {time}
                        {status === "booked" && (
                          <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                            Ocupado
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-green-300 bg-green-50 rounded mr-2" />
                    <span className="text-neutral-600">Disponível</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-red-300 bg-red-50 rounded mr-2" />
                    <span className="text-neutral-600">Ocupado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-neutral-300 bg-neutral-50 rounded mr-2" />
                    <span className="text-neutral-600">Indisponível</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}