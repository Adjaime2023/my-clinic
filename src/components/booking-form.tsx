import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Calendar, Clock, User, IdCard, Phone, Stethoscope, MessageSquare, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { validateCPF, formatCPF, formatPhone } from "@/lib/validators";
import InteractiveCalendar from "./interactive-calendar";

const bookingSchema = z.object({
  patientName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  patientCpf: z.string().refine((cpf) => {
    if (!cpf) return false;
    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length < 11) return false;
    return validateCPF(cpf);
  }, "CPF inválido"),
  patientPhone: z.string().refine((phone) => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }, "Telefone deve ter 10 ou 11 dígitos"),
  specialty: z.string().min(1, "Selecione uma especialidade"),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  observations: z.string().optional(),
  status: z.literal("pending").default("pending"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onBack: () => void;
}

export default function BookingForm({ onBack }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onBlur", // Only validate when field loses focus
    defaultValues: {
      patientName: "",
      patientCpf: "",
      patientPhone: "",
      specialty: "",
      date: "",
      time: "",
      observations: "",
      status: "pending",
    },
  });

  const { data: availableTimes = [], isLoading: loadingTimes } = useQuery({
    queryKey: ["/api/appointments/available", selectedDate],
    enabled: !!selectedDate,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Agendamento realizado!",
        description: "Sua consulta foi agendada com sucesso. Você receberá uma confirmação em breve.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      form.reset();
      onBack();
    },
    onError: () => {
      toast({
        title: "Erro no agendamento",
        description: "Não foi possível agendar sua consulta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createAppointmentMutation.mutate(data);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    form.setValue("date", date);
    form.setValue("time", ""); // Reset time when date changes
  };

  const handleTimeChange = (time: string) => {
    form.setValue("time", time);
  };

  const specialties = [
    { value: "limpeza", label: "Limpeza e Profilaxia" },
    { value: "canal", label: "Tratamento de Canal" },
    { value: "ortodontia", label: "Ortodontia" },
    { value: "implante", label: "Implante Dentário" },
    { value: "extracao", label: "Extração" },
    { value: "clareamento", label: "Clareamento" },
    { value: "emergencia", label: "Emergência" },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-2xl font-bold text-neutral-800">
              <Calendar className="inline mr-3 text-primary" />
              Agendamento de Consulta
            </h3>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Toggle between Calendar and Form View */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-lg border border-neutral-200 p-1">
                  <Button
                    type="button"
                    variant={showCalendar ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setShowCalendar(true)}
                    className="rounded-md"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendário Interativo
                  </Button>
                  <Button
                    type="button"
                    variant={!showCalendar ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setShowCalendar(false)}
                    className="rounded-md"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Seleção Manual
                  </Button>
                </div>
              </div>

              {/* Interactive Calendar */}
              {showCalendar ? (
                <div className="mb-6">
                  <InteractiveCalendar
                    onDateSelect={handleDateChange}
                    onTimeSelect={handleTimeChange}
                    selectedDate={form.watch("date")}
                    selectedTime={form.watch("time")}
                  />
                  {/* Hidden form fields to maintain form state */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                /* Manual Date and Time Selection */
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-primary" />
                          Data da Consulta
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            onChange={(e) => handleDateChange(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-primary" />
                          Horário
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDate || loadingTimes}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={loadingTimes ? "Carregando..." : "Selecione o horário"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTimes.map((time: string) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Patient Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-primary" />
                        Nome Completo *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientCpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <IdCard className="mr-2 h-4 w-4 text-primary" />
                        CPF *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          value={field.value}
                          onChange={(e) => {
                            const formatted = formatCPF(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={14}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-primary" />
                        Telefone (com DDD) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={field.value}
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Stethoscope className="mr-2 h-4 w-4 text-primary" />
                        Especialidade *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a especialidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty.value} value={specialty.value}>
                              {specialty.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Information */}
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                      Observações (opcional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Descreva seus sintomas ou observações importantes..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmation Options */}
              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-neutral-700 mb-3">Como deseja receber a confirmação?</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="whatsapp" defaultChecked />
                    <label htmlFor="whatsapp" className="text-sm text-neutral-700">WhatsApp</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email" />
                    <label htmlFor="email" className="text-sm text-neutral-700">E-mail</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms" />
                    <label htmlFor="sms" className="text-sm text-neutral-700">SMS</label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <Button
                  type="submit"
                  disabled={createAppointmentMutation.isPending}
                  className="bg-secondary hover:bg-green-600 text-white font-semibold px-8 py-4 text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  <Check className="mr-2 h-5 w-5" />
                  {createAppointmentMutation.isPending ? "Agendando..." : "Confirmar Agendamento"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
