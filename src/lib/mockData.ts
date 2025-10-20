export interface Appointment {
  id: string;
  full_name: string;
  birth_date: string;
  gender: string;
  document: string;
  phone: string;
  email: string;
  chief_complaint: string;
  medical_history?: string;
  allergies?: string;
  medications?: string;
  insurance_provider?: string;
  insurance_number?: string;
  requires_authorization: boolean;
  specialty: string;
  preferred_doctor?: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Dados mockados iniciais
let mockAppointments: Appointment[] = [
  {
    id: '1',
    full_name: 'Maria Silva Santos',
    birth_date: '1985-03-15',
    gender: 'Feminino',
    document: '123.456.789-00',
    phone: '(11) 99999-1234',
    email: 'maria.silva@email.com',
    chief_complaint: 'Dor de cabeça frequente e tontura',
    medical_history: 'Hipertensão arterial',
    allergies: 'Penicilina',
    medications: 'Losartana 50mg',
    insurance_provider: 'Unimed',
    insurance_number: '123456789',
    requires_authorization: true,
    specialty: 'Neurologia',
    preferred_doctor: 'Dr. João Oliveira',
    appointment_date: '2024-01-20',
    appointment_time: '14:30',
    appointment_type: 'Presencial',
    emergency_contact_name: 'José Silva',
    emergency_contact_phone: '(11) 88888-5678',
    emergency_contact_relation: 'Cônjuge',
    notes: 'Paciente relata piora dos sintomas nos últimos dias',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    full_name: 'Carlos Eduardo Lima',
    birth_date: '1978-07-22',
    gender: 'Masculino',
    document: '987.654.321-00',
    phone: '(11) 97777-4321',
    email: 'carlos.lima@email.com',
    chief_complaint: 'Consulta de rotina para check-up anual',
    medical_history: 'Diabetes tipo 2',
    allergies: 'Nenhuma',
    medications: 'Metformina 850mg',
    insurance_provider: 'Bradesco Saúde',
    insurance_number: '987654321',
    requires_authorization: false,
    specialty: 'Clínica Geral',
    preferred_doctor: 'Dra. Ana Costa',
    appointment_date: '2024-01-25',
    appointment_time: '09:00',
    appointment_type: 'Presencial',
    emergency_contact_name: 'Fernanda Lima',
    emergency_contact_phone: '(11) 86666-9876',
    emergency_contact_relation: 'Esposa',
    notes: 'Paciente em bom controle glicêmico',
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z'
  },
  {
    id: '3',
    full_name: 'Ana Paula Rodrigues',
    birth_date: '1992-11-08',
    gender: 'Feminino',
    document: '456.789.123-00',
    phone: '(11) 95555-6789',
    email: 'ana.rodrigues@email.com',
    chief_complaint: 'Dor abdominal e náuseas',
    medical_history: 'Gastrite crônica',
    allergies: 'Ibuprofeno',
    medications: 'Omeprazol 20mg',
    insurance_provider: 'SulAmérica',
    insurance_number: '456789123',
    requires_authorization: false,
    specialty: 'Gastroenterologia',
    preferred_doctor: 'Dr. Roberto Mendes',
    appointment_date: '2024-01-18',
    appointment_time: '16:00',
    appointment_type: 'Teleconsulta',
    emergency_contact_name: 'Pedro Rodrigues',
    emergency_contact_phone: '(11) 84444-3210',
    emergency_contact_relation: 'Pai',
    notes: 'Sintomas pioraram após refeições',
    created_at: '2024-01-14T09:15:00Z',
    updated_at: '2024-01-14T09:15:00Z'
  }
];

// Funções para simular operações do banco de dados
export const mockDatabase = {
  // Buscar todas as consultas
  async getAppointments(): Promise<Appointment[]> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockAppointments].sort((a, b) => {
      const dateA = new Date(`${a.appointment_date} ${a.appointment_time}`);
      const dateB = new Date(`${b.appointment_date} ${b.appointment_time}`);
      return dateA.getTime() - dateB.getTime();
    });
  },

  // Adicionar nova consulta
  async addAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockAppointments.push(newAppointment);
    return newAppointment;
  },

  // Atualizar consulta
  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<Appointment | null> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = mockAppointments.findIndex(apt => apt.id === id);
    if (index === -1) return null;
    
    mockAppointments[index] = {
      ...mockAppointments[index],
      ...appointmentData,
      updated_at: new Date().toISOString()
    };
    
    return mockAppointments[index];
  },

  // Deletar consulta
  async deleteAppointment(id: string): Promise<boolean> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockAppointments.findIndex(apt => apt.id === id);
    if (index === -1) return false;
    
    mockAppointments.splice(index, 1);
    return true;
  },

  // Buscar consulta por ID
  async getAppointmentById(id: string): Promise<Appointment | null> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockAppointments.find(apt => apt.id === id) || null;
  }
};
