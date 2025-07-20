import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Zap, Plus, Ban, Users, BarChart3, Settings, Grid } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@shared/schema";
import InteractiveCalendar from "./interactive-calendar";

export default function MiniCalendar() {
  const [currentDate] = useState(new Date());
  const [showDetailedView, setShowDetailedView] = useState(false);
  
  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments"],
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
    if (dayAppointments.length === 0) return null;
    
    const hasPending = dayAppointments.some((apt: Appointment) => apt.status === "pending");
    return hasPending ? "pending" : "confirmed";
  };

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="space-y-6">
      {/* Calendar View Toggle */}
      <Card className="shadow-sm border border-neutral-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-800">
              <Calendar className="inline mr-2 text-primary" />
              {showDetailedView ? "Calendário Detalhado" : format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailedView(!showDetailedView)}
              className="text-sm"
            >
              <Grid className="mr-2 h-4 w-4" />
              {showDetailedView ? "Vista Simples" : "Vista Detalhada"}
            </Button>
          </div>

          {showDetailedView ? (
            <div className="mb-4">
              <InteractiveCalendar />
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-xs font-medium text-neutral-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((day) => {
                  const dayStatus = getDayStatus(day);
                  const appointmentCount = getAppointmentsForDate(day).length;
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`
                        p-2 text-sm cursor-pointer rounded relative transition-colors
                        ${!isSameMonth(day, currentDate) ? "text-neutral-400" : "hover:bg-neutral-100"}
                        ${isToday(day) ? "bg-primary text-white font-medium" : ""}
                      `}
                    >
                      {format(day, "d")}
                      {dayStatus && appointmentCount > 0 && (
                        <div 
                          className={`
                            w-2 h-2 rounded-full absolute bottom-0 right-0
                            ${dayStatus === "pending" ? "bg-accent" : "bg-secondary"}
                          `}
                          title={`${appointmentCount} agendamento(s)`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 text-xs space-y-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary rounded-full mr-2" />
                  <span className="text-neutral-600">Confirmado</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2" />
                  <span className="text-neutral-600">Pendente</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-sm border border-neutral-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            <Zap className="inline mr-2 text-primary" />
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-3 h-auto border border-neutral-200 hover:bg-neutral-50"
            >
              <Plus className="mr-3 h-4 w-4 text-primary" />
              <span className="font-medium">Novo Agendamento</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-3 h-auto border border-neutral-200 hover:bg-neutral-50"
            >
              <Ban className="mr-3 h-4 w-4 text-accent" />
              <span className="font-medium">Bloquear Horário</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-3 h-auto border border-neutral-200 hover:bg-neutral-50"
            >
              <Users className="mr-3 h-4 w-4 text-secondary" />
              <span className="font-medium">Gerenciar Dentistas</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-3 h-auto border border-neutral-200 hover:bg-neutral-50"
            >
              <BarChart3 className="mr-3 h-4 w-4 text-primary" />
              <span className="font-medium">Relatórios</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start px-4 py-3 h-auto border border-neutral-200 hover:bg-neutral-50"
            >
              <Settings className="mr-3 h-4 w-4 text-neutral-600" />
              <span className="font-medium">Configurações</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
