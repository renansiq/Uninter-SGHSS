import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDatabase, Appointment } from '@/lib/mockData';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  full_name: z.string().min(1, 'Nome é obrigatório'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  gender: z.enum(['Masculino', 'Feminino', 'Outro']),
  document: z.string().min(1, 'Documento é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido'),
  chief_complaint: z.string().min(1, 'Queixa principal é obrigatória'),
  medical_history: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_number: z.string().optional(),
  requires_authorization: z.boolean().default(false),
  specialty: z.string().min(1, 'Especialidade é obrigatória'),
  preferred_doctor: z.string().optional(),
  appointment_date: z.string().min(1, 'Data da consulta é obrigatória'),
  appointment_time: z.string().min(1, 'Horário é obrigatório'),
  appointment_type: z.enum(['Presencial', 'Teleconsulta']),
  emergency_contact_name: z.string().min(1, 'Nome do contato de emergência é obrigatório'),
  emergency_contact_phone: z.string().min(1, 'Telefone do contato de emergência é obrigatório'),
  emergency_contact_relation: z.string().min(1, 'Relação é obrigatória'),
  notes: z.string().optional(),
});

const specialties = [
  'Cardiologia',
  'Dermatologia',
  'Endocrinologia',
  'Gastroenterologia',
  'Ginecologia',
  'Neurologia',
  'Oftalmologia',
  'Ortopedia',
  'Pediatria',
  'Psiquiatria',
  'Urologia',
  'Clínica Geral',
];

interface AppointmentFormProps {
  onSuccess?: () => void;
  editingAppointment?: Appointment | null;
  onCancelEdit?: () => void;
}

export function AppointmentForm({ onSuccess, editingAppointment, onCancelEdit }: AppointmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: 'Masculino',
      appointment_type: 'Presencial',
      requires_authorization: false,
      full_name: '',
      birth_date: '',
      document: '',
      phone: '',
      email: '',
      chief_complaint: '',
      medical_history: '',
      allergies: '',
      medications: '',
      insurance_provider: '',
      insurance_number: '',
      specialty: '',
      preferred_doctor: '',
      appointment_date: '',
      appointment_time: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relation: '',
      notes: '',
    },
  });

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingAppointment) {
      form.reset({
        full_name: editingAppointment.full_name,
        birth_date: editingAppointment.birth_date,
        gender: editingAppointment.gender as 'Masculino' | 'Feminino' | 'Outro',
        document: editingAppointment.document,
        phone: editingAppointment.phone,
        email: editingAppointment.email,
        chief_complaint: editingAppointment.chief_complaint,
        medical_history: editingAppointment.medical_history || '',
        allergies: editingAppointment.allergies || '',
        medications: editingAppointment.medications || '',
        insurance_provider: editingAppointment.insurance_provider || '',
        insurance_number: editingAppointment.insurance_number || '',
        requires_authorization: editingAppointment.requires_authorization,
        specialty: editingAppointment.specialty,
        preferred_doctor: editingAppointment.preferred_doctor || '',
        appointment_date: editingAppointment.appointment_date,
        appointment_time: editingAppointment.appointment_time,
        appointment_type: editingAppointment.appointment_type as 'Presencial' | 'Teleconsulta',
        emergency_contact_name: editingAppointment.emergency_contact_name,
        emergency_contact_phone: editingAppointment.emergency_contact_phone,
        emergency_contact_relation: editingAppointment.emergency_contact_relation,
        notes: editingAppointment.notes || '',
      });
    }
  }, [editingAppointment, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (editingAppointment) {
        await mockDatabase.updateAppointment(editingAppointment.id, values);
        toast.success('Consulta atualizada com sucesso!');
      } else {
        await mockDatabase.addAppointment(values);
        toast.success('Consulta agendada com sucesso!');
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(editingAppointment ? 'Erro ao atualizar consulta. Tente novamente.' : 'Erro ao agendar consulta. Tente novamente.');
      console.error('Error:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais do Paciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Masculino" id="masculino" />
                        <label htmlFor="masculino" className="font-normal cursor-pointer text-sm">Masculino</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Feminino" id="feminino" />
                        <label htmlFor="feminino" className="font-normal cursor-pointer text-sm">Feminino</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Outro" id="outro" />
                        <label htmlFor="outro" className="font-normal cursor-pointer text-sm">Outro</label>
                      </div>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento (RG/CPF)</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Saúde</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="chief_complaint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Queixa principal / motivo da consulta</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o motivo da consulta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medical_history"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doenças crônicas / histórico médico relevante</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Histórico médico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alergias</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Lista de alergias" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamentos em uso</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Lista de medicamentos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Plano de Saúde</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="insurance_provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operadora</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da operadora" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insurance_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da carteirinha</FormLabel>
                    <FormControl>
                      <Input placeholder="Número da carteirinha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requires_authorization"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Autorização / guia necessária</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados da Consulta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Médico / profissional preferencial</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do médico (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appointment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointment_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="appointment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de atendimento</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Presencial" id="presencial" />
                      <label htmlFor="presencial" className="font-normal cursor-pointer text-sm">Presencial</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Teleconsulta" id="teleconsulta" />
                      <label htmlFor="teleconsulta" className="font-normal cursor-pointer text-sm">Teleconsulta</label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato de Emergência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="emergency_contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato de emergência" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="emergency_contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergency_contact_relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relação</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Mãe, Pai, Cônjuge" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações / Necessidades Especiais</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais ou necessidades especiais"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          {editingAppointment && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onCancelEdit}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            size="lg"
            className={editingAppointment ? "flex-1" : "w-full"}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editingAppointment ? 'Atualizando...' : 'Agendando...'}
              </>
            ) : (
              editingAppointment ? 'Atualizar Consulta' : 'Agendar Consulta'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
