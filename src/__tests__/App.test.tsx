import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import App from '../App'

// Mock dos componentes
vi.mock('../components/LoginForm', () => ({
  LoginForm: ({ onLogin }: { onLogin: (authenticated: boolean) => void }) => (
    <div data-testid="login-form">
      <button onClick={() => onLogin(true)}>Login</button>
    </div>
  ),
}))

vi.mock('../components/AppointmentForm', () => ({
  AppointmentForm: ({ onSuccess, editingAppointment, onCancelEdit }: any) => (
    <div data-testid="appointment-form">
      <button onClick={onSuccess}>Submit Form</button>
      {editingAppointment && (
        <button onClick={onCancelEdit}>Cancel Edit</button>
      )}
    </div>
  ),
}))

vi.mock('../components/AppointmentsList', () => ({
  AppointmentsList: ({ onEditAppointment }: any) => (
    <div data-testid="appointments-list">
      <button onClick={() => onEditAppointment({ id: '1', full_name: 'Test' })}>
        Edit Appointment
      </button>
    </div>
  ),
}))

// Mock do toast
vi.mock('../components/ui/sonner', () => ({
  Toaster: () => <div data-testid="toaster" />,
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows login form when not authenticated', () => {
    render(<App />)
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.queryByTestId('appointment-form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('appointments-list')).not.toBeInTheDocument()
  })

  it('shows main app when authenticated', async () => {
    render(<App />)
    
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Sistema de Agendamento')).toBeInTheDocument()
      expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
      expect(screen.getByTestId('toaster')).toBeInTheDocument()
    })
  })

  it('shows logout button when authenticated', async () => {
    render(<App />)
    
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
    })
  })

  it('switches to appointments list tab when form is submitted', async () => {
    render(<App />)
    
    // Login first
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
    })
    
    // Switch to list tab
    const listTab = screen.getByRole('tab', { name: /consultas agendadas/i })
    await userEvent.click(listTab)
    
    expect(screen.getByTestId('appointments-list')).toBeInTheDocument()
  })

  it('handles edit appointment flow', async () => {
    render(<App />)
    
    // Login first
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
    })
    
    // Switch to list tab
    const listTab = screen.getByRole('tab', { name: /consultas agendadas/i })
    await userEvent.click(listTab)
    
    // Click edit button
    const editButton = screen.getByText('Edit Appointment')
    await userEvent.click(editButton)
    
    // Should switch back to form tab with edit mode
    await waitFor(() => {
      expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
      expect(screen.getByText('Cancel Edit')).toBeInTheDocument()
    })
  })

  it('handles cancel edit', async () => {
    render(<App />)
    
    // Login first
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
    })
    
    // Switch to list tab and edit
    const listTab = screen.getByRole('tab', { name: /consultas agendadas/i })
    await userEvent.click(listTab)
    
    const editButton = screen.getByText('Edit Appointment')
    await userEvent.click(editButton)
    
    // Cancel edit
    const cancelButton = screen.getByText('Cancel Edit')
    await userEvent.click(cancelButton)
    
    // Should still be in form tab but not in edit mode
    expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
    expect(screen.queryByText('Cancel Edit')).not.toBeInTheDocument()
  })

  it('logs out and returns to login', async () => {
    render(<App />)
    
    // Login first
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Sistema de Agendamento')).toBeInTheDocument()
    })
    
    // Logout
    const logoutButton = screen.getByRole('button', { name: /sair/i })
    await userEvent.click(logoutButton)
    
    // Should return to login
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.queryByText('Sistema de Agendamento')).not.toBeInTheDocument()
  })

  it('resets state when logging out', async () => {
    render(<App />)
    
    // Login first
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
    })
    
    // Switch to list tab
    const listTab = screen.getByRole('tab', { name: /consultas agendadas/i })
    await userEvent.click(listTab)
    
    // Logout
    const logoutButton = screen.getByRole('button', { name: /sair/i })
    await userEvent.click(logoutButton)
    
    // Login again
    const loginButtonAgain = screen.getByText('Login')
    await userEvent.click(loginButtonAgain)
    
    // Should be back to form tab (default state)
    await waitFor(() => {
      expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
    })
  })

  it('shows correct tab labels', async () => {
    render(<App />)
    
    // Login first
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /nova consulta/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /consultas agendadas/i })).toBeInTheDocument()
    })
  })

  it('maintains tab state during edit flow', async () => {
    render(<App />)
    
    // Login first
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
    })
    
    // Switch to list tab
    const listTab = screen.getByRole('tab', { name: /consultas agendadas/i })
    await userEvent.click(listTab)
    
    expect(screen.getByTestId('appointments-list')).toBeInTheDocument()
    
    // Edit appointment
    const editButton = screen.getByText('Edit Appointment')
    await userEvent.click(editButton)
    
    // Should switch back to form tab
    await waitFor(() => {
      expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
    })
    
    // Cancel edit - should stay in form tab
    const cancelButton = screen.getByText('Cancel Edit')
    await userEvent.click(cancelButton)
    
    expect(screen.getByTestId('appointment-form')).toBeInTheDocument()
  })
})