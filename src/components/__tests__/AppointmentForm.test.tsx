import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import { AppointmentForm } from '../AppointmentForm'
import { Appointment } from '@/lib/mockData'

// Mock do mockDatabase
vi.mock('@/lib/mockData', () => ({
  mockDatabase: {
    addAppointment: vi.fn(),
    updateAppointment: vi.fn(),
  },
  Appointment: {},
}))

// Mock do toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('AppointmentForm', () => {
  const mockOnSuccess = vi.fn()
  const mockOnCancelEdit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form sections', () => {
    render(<AppointmentForm onSuccess={mockOnSuccess} />)
    
    expect(screen.getByText('Dados Pessoais do Paciente')).toBeInTheDocument()
    expect(screen.getByText('Informações de Saúde')).toBeInTheDocument()
    expect(screen.getByText('Informações do Plano de Saúde')).toBeInTheDocument()
    expect(screen.getByText('Dados da Consulta')).toBeInTheDocument()
    expect(screen.getByText('Contato de Emergência')).toBeInTheDocument()
    expect(screen.getByText('Observações / Necessidades Especiais')).toBeInTheDocument()
  })

  it('renders form fields', () => {
    render(<AppointmentForm onSuccess={mockOnSuccess} />)
    
    expect(screen.getByText('Nome completo')).toBeInTheDocument()
    expect(screen.getByText('Data de nascimento')).toBeInTheDocument()
    expect(screen.getByText('Sexo')).toBeInTheDocument()
    expect(screen.getAllByText('Telefone')).toHaveLength(2) // Paciente e contato de emergência
    expect(screen.getByText('E-mail')).toBeInTheDocument()
    expect(screen.getByText('Especialidade')).toBeInTheDocument()
    expect(screen.getByText('Data')).toBeInTheDocument()
    expect(screen.getByText('Horário')).toBeInTheDocument()
    expect(screen.getByText('Tipo de atendimento')).toBeInTheDocument()
  })

  it('shows radio button options for gender', () => {
    render(<AppointmentForm onSuccess={mockOnSuccess} />)
    
    expect(screen.getByText('Masculino')).toBeInTheDocument()
    expect(screen.getByText('Feminino')).toBeInTheDocument()
    expect(screen.getByText('Outro')).toBeInTheDocument()
  })

  it('shows radio button options for appointment type', () => {
    render(<AppointmentForm onSuccess={mockOnSuccess} />)
    
    expect(screen.getByText('Presencial')).toBeInTheDocument()
    expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<AppointmentForm onSuccess={mockOnSuccess} />)
    
    const submitButton = screen.getByRole('button', { name: /agendar consulta/i })
    await user.click(submitButton)
    
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Data de nascimento é obrigatória')).toBeInTheDocument()
    expect(screen.getByText('Documento é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Telefone é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    expect(screen.getByText('Queixa principal é obrigatória')).toBeInTheDocument()
    expect(screen.getByText('Especialidade é obrigatória')).toBeInTheDocument()
    expect(screen.getByText('Data da consulta é obrigatória')).toBeInTheDocument()
    expect(screen.getByText('Horário é obrigatório')).toBeInTheDocument()
  })

  it('shows edit mode when editing appointment', () => {
    const editingAppointment: Appointment = {
      id: '1',
      full_name: 'João Silva',
      birth_date: '1990-01-01',
      gender: 'Masculino',
      document: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'joao@email.com',
      chief_complaint: 'Dor de cabeça',
      medical_history: '',
      allergies: '',
      medications: '',
      insurance_provider: '',
      insurance_number: '',
      requires_authorization: false,
      specialty: 'Cardiologia',
      preferred_doctor: '',
      appointment_date: '2024-12-31',
      appointment_time: '14:00',
      appointment_type: 'Presencial',
      emergency_contact_name: 'Maria Silva',
      emergency_contact_phone: '(11) 88888-8888',
      emergency_contact_relation: 'Esposa',
      notes: '',
      created_at: '',
      updated_at: ''
    }
    
    render(
      <AppointmentForm 
        onSuccess={mockOnSuccess} 
        editingAppointment={editingAppointment}
        onCancelEdit={mockOnCancelEdit}
      />
    )
    
    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument()
    expect(screen.getByDisplayValue('joao@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /atualizar consulta/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('calls onCancelEdit when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const editingAppointment: Appointment = {
      id: '1',
      full_name: 'João Silva',
      birth_date: '1990-01-01',
      gender: 'Masculino',
      document: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'joao@email.com',
      chief_complaint: 'Dor de cabeça',
      medical_history: '',
      allergies: '',
      medications: '',
      insurance_provider: '',
      insurance_number: '',
      requires_authorization: false,
      specialty: 'Cardiologia',
      preferred_doctor: '',
      appointment_date: '2024-12-31',
      appointment_time: '14:00',
      appointment_type: 'Presencial',
      emergency_contact_name: 'Maria Silva',
      emergency_contact_phone: '(11) 88888-8888',
      emergency_contact_relation: 'Esposa',
      notes: '',
      created_at: '',
      updated_at: ''
    }
    
    render(
      <AppointmentForm 
        onSuccess={mockOnSuccess} 
        editingAppointment={editingAppointment}
        onCancelEdit={mockOnCancelEdit}
      />
    )
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)
    
    expect(mockOnCancelEdit).toHaveBeenCalled()
  })
})