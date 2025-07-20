import { useState } from "react"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { List, Plus, Phone, MessageCircle, Check, X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Appointment } from "@shared/schema";

export default function AppointmentsList() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments", { date: dateFilter }],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/appointments/${id}/status`, { status });
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Status atualizado!",
        description: `Agendamento ${variables.status === "confirmed" ? "confirmado" : "cancelado"} com sucesso.`,
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive",
      });
    },
  });

  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.patientPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleStatusUpdate = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-secondary text-white">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-accent text-white">Pendente</Badge>;
      case "canceled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSpecialtyLabel = (specialty: string) => {
    const specialties: Record<string, string> = {
      limpeza: "Limpeza",
      canal: "Canal",
      ortodontia: "Ortodontia",
      implante: "Implante",
      extracao: "Extração",
      clareamento: "Clareamento",
      emergencia: "Emergência",
    };
    return specialties[specialty] || specialty;
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const message = `Olá ${name}, sua consulta está confirmada para hoje. Aguardamos você!`;
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border border-neutral-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-neutral-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-neutral-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">
            <List className="inline mr-2 text-primary" />
            Agendamentos de {format(new Date(dateFilter), "dd/MM/yyyy", { locale: ptBR })}
          </h3>
          <Button className="bg-primary hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
          />

          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              Nenhum agendamento encontrado para os filtros selecionados.
            </div>
          ) : (
            filteredAppointments.map((appointment: Appointment) => (
              <div key={appointment.id} className="p-4 hover:bg-neutral-50 transition-colors border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm">
                        {appointment.time}
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-800">{appointment.patientName}</h4>
                        <p className="text-sm text-neutral-600">
                          <Phone className="inline mr-1 h-3 w-3" />{appointment.patientPhone} • 
                          <span className="text-primary ml-1">{getSpecialtyLabel(appointment.specialty)}</span>
                        </p>
                        {appointment.observations && (
                          <p className="text-xs text-neutral-500">
                            <MessageCircle className="inline mr-1 h-3 w-3" />
                            {appointment.observations}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(appointment.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleWhatsApp(appointment.patientPhone, appointment.patientName)}
                      className="text-green-600 hover:text-green-700"
                      title="WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCall(appointment.patientPhone)}
                      className="text-primary hover:text-blue-700"
                      title="Ligar"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    {appointment.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
                        className="text-green-600 hover:text-green-700"
                        title="Confirmar"
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    {appointment.status !== "canceled" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(appointment.id, "canceled")}
                        className="text-red-500 hover:text-red-700"
                        title="Cancelar"
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
