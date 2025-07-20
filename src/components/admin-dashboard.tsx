import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CalendarDays, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AppointmentsList from "./appointments-list";
import MiniCalendar from "./mini-calendar";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/statistics"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-neutral-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Hoje</p>
                <p className="text-2xl font-bold text-neutral-800">{stats?.todayAppointments || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pendentes</p>
                <p className="text-2xl font-bold text-accent">{stats?.pendingAppointments || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Esta Semana</p>
                <p className="text-2xl font-bold text-secondary">{stats?.weekAppointments || 0}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-neutral-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Cancelamentos</p>
                <p className="text-2xl font-bold text-red-500">{stats?.canceledAppointments || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AppointmentsList />
        </div>
        <div>
          <MiniCalendar />
        </div>
      </div>
    </div>
  );
}
