import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { AppointmentsList } from '../AppointmentsList'
import { Appointment } from '@/lib/mockData'

vi.mock('@/lib/mockData', () => ({
  mockDatabase: {
    getAppointments: vi.fn(),
    deleteAppointment: vi.fn(),
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

// Mock do date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((_, formatStr) => {
    if (formatStr === 'dd/MM/yyyy') return '01/01/1990'
    if (formatStr === "dd 'de' MMMM 'de' yyyy") return '01 de janeiro de 1990'
    return '01/01/1990'
  }),
}))

vi.mock('date-fns/locale', () => ({
  ptBR: {},
}))

describe('AppointmentsList', () => {
  const mockOnEditAppointment = vi.fn()
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      full_name: 'João Silva',
      birth_date: '1990-01-01',
      gender: 'Masculino',
      document: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'joao@email.com',
      chief_complaint: 'Dor de cabeça',
      medical_history: 'Hipertensão',
      allergies: 'Penicilina',
      medications: 'Losartana',
      insurance_provider: 'Unimed',
      insurance_number: '123456',
      requires_authorization: true,
      specialty: 'Cardiologia',
      preferred_doctor: 'Dr. Carlos',
      appointment_date: '2024-12-31',
      appointment_time: '14:00',
      appointment_type: 'Presencial',
      emergency_contact_name: 'Maria Silva',
      emergency_contact_phone: '(11) 88888-8888',
      emergency_contact_relation: 'Esposa',
      notes: 'Paciente idoso',
      created_at: '',
      updated_at: ''
    },
    {
      id: '2',
      full_name: 'Ana Santos',
      birth_date: '1985-05-15',
      gender: 'Feminino',
      document: '987.654.321-00',
      phone: '(11) 77777-7777',
      email: 'ana@email.com',
      chief_complaint: 'Consulta de rotina',
      medical_history: '',
      allergies: '',
      medications: '',
      insurance_provider: '',
      insurance_number: '',
      requires_authorization: false,
      specialty: 'Clínica Geral',
      preferred_doctor: '',
      appointment_date: '2024-12-30',
      appointment_time: '10:00',
      appointment_type: 'Teleconsulta',
      emergency_contact_name: 'Pedro Santos',
      emergency_contact_phone: '(11) 66666-6666',
      emergency_contact_relation: 'Marido',
      notes: '',
      created_at: '',
      updated_at: ''
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no appointments', async () => {
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue([])

    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)

    await waitFor(() => {
      expect(screen.getByText('Nenhuma consulta agendada ainda.')).toBeInTheDocument()
    })
  })

  it('renders appointments list', async () => {
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue(mockAppointments)

    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('Ana Santos')).toBeInTheDocument()
    })
  })

  it('displays appointment information correctly', async () => {
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue([mockAppointments[0]])
    
    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('01/01/1990 • Masculino')).toBeInTheDocument()
      expect(screen.getByText('Presencial')).toBeInTheDocument()
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
      expect(screen.getByText('Dor de cabeça')).toBeInTheDocument()
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument()
      expect(screen.getByText('joao@email.com')).toBeInTheDocument()
      expect(screen.getByText('Paciente idoso')).toBeInTheDocument()
    })
  })

  it('calls onEditAppointment when edit button is clicked', async () => {
    const user = userEvent.setup()
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue([mockAppointments[0]])

    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })
    
    const editButton = screen.getByRole('button', { name: /editar consulta de joão silva/i })
    await user.click(editButton)
    
    expect(mockOnEditAppointment).toHaveBeenCalledWith(mockAppointments[0])
  })

  it('opens delete confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup()
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue([mockAppointments[0]])
    
    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getByRole('button', { name: /excluir consulta de joão silva/i })
    await user.click(deleteButton)
    
    expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument()
    expect(screen.getByText(/Tem certeza que deseja remover/)).toBeInTheDocument()
  })

  it('deletes appointment when confirmed', async () => {
    const user = userEvent.setup()
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue([mockAppointments[0]])
    vi.spyOn(mockDatabase, 'deleteAppointment').mockResolvedValue(true)
    
    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getByRole('button', { name: /excluir consulta de joão silva/i })
    await user.click(deleteButton)
    
    const confirmButton = screen.getByRole('button', { name: /remover/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(mockDatabase.deleteAppointment).toHaveBeenCalledWith('1')
    })
  })

  it('cancels deletion when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue([mockAppointments[0]])
    
    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getByRole('button', { name: /excluir consulta de joão silva/i })
    await user.click(deleteButton)
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    await user.click(cancelButton)
    
    expect(screen.queryByText('Confirmar exclusão')).not.toBeInTheDocument()
    expect(mockDatabase.deleteAppointment).not.toHaveBeenCalled()
  })

  it('handles delete error gracefully', async () => {
    const user = userEvent.setup()
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue([mockAppointments[0]])
    vi.spyOn(mockDatabase, 'deleteAppointment').mockRejectedValue(new Error('Delete failed'))
    
    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)
    
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getByRole('button', { name: /excluir consulta de joão silva/i })
    await user.click(deleteButton)
    
    const confirmButton = screen.getByRole('button', { name: /remover/i })
    await user.click(confirmButton)
    
    await waitFor(() => {
      expect(mockDatabase.deleteAppointment).toHaveBeenCalledWith('1')
    })
  })

  it('shows different badge for teleconsultation', async () => {
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue([mockAppointments[1]])
    
    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)
    
    await waitFor(() => {
      expect(screen.getByText('Teleconsulta')).toBeInTheDocument()
    })
  })

  it('handles appointments without optional fields', async () => {
    const appointmentWithoutOptional: Appointment = {
      id: '3',
      full_name: 'Pedro Costa',
      birth_date: '1992-03-20',
      gender: 'Masculino',
      document: '111.222.333-44',
      phone: '(11) 55555-5555',
      email: 'pedro@email.com',
      chief_complaint: 'Consulta simples',
      medical_history: '',
      allergies: '',
      medications: '',
      insurance_provider: '',
      insurance_number: '',
      requires_authorization: false,
      specialty: 'Clínica Geral',
      preferred_doctor: '',
      appointment_date: '2024-12-25',
      appointment_time: '09:00',
      appointment_type: 'Presencial',
      emergency_contact_name: 'João Costa',
      emergency_contact_phone: '(11) 44444-4444',
      emergency_contact_relation: 'Irmão',
      notes: '',
      created_at: '',
      updated_at: ''
    }
    
    const { mockDatabase } = await import('@/lib/mockData')
    vi.spyOn(mockDatabase, 'getAppointments').mockResolvedValue([appointmentWithoutOptional])
    
    render(<AppointmentsList onEditAppointment={mockOnEditAppointment} />)
    
    await waitFor(() => {
      expect(screen.getByText('Pedro Costa')).toBeInTheDocument()
      expect(screen.queryByText('Plano de Saúde:')).not.toBeInTheDocument()
      expect(screen.queryByText('Observações:')).not.toBeInTheDocument()
    })
  })
})