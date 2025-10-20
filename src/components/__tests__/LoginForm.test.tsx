import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import { LoginForm } from '../LoginForm'

// Mock do toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('LoginForm', () => {
  const mockOnLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form with all elements', () => {
    render(<LoginForm onLogin={mockOnLogin} />)
    
    expect(screen.getByText('Sistema de Agendamento')).toBeInTheDocument()
    expect(screen.getByText('Faça login para acessar o sistema')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite seu usuário')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('shows test credentials', () => {
    render(<LoginForm onLogin={mockOnLogin} />)
    
    expect(screen.getByText('Credenciais de teste:')).toBeInTheDocument()
    expect(screen.getAllByText('admin')).toHaveLength(2) // Usuário e senha
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    await user.click(submitButton)
    
    expect(screen.getByText('Usuário é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument()
    expect(mockOnLogin).not.toHaveBeenCalled()
  })

  it('shows loading state when submitting', async () => {
    const user = userEvent.setup()
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const usernameInput = screen.getByPlaceholderText('Digite seu usuário')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin')
    await user.click(submitButton)
    
    expect(screen.getByText('Entrando...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onLogin with true for valid credentials', async () => {
    const user = userEvent.setup()
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const usernameInput = screen.getByPlaceholderText('Digite seu usuário')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(true)
    })
  })

  it('calls onLogin with false for invalid credentials', async () => {
    const user = userEvent.setup()
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const usernameInput = screen.getByPlaceholderText('Digite seu usuário')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    
    await user.type(usernameInput, 'wrong')
    await user.type(passwordInput, 'wrong')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(false)
    })
  })

  it('handles form submission with Enter key', async () => {
    const user = userEvent.setup()
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const usernameInput = screen.getByPlaceholderText('Digite seu usuário')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin')
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(true)
    })
  })

  it('clears form after successful login', async () => {
    const user = userEvent.setup()
    render(<LoginForm onLogin={mockOnLogin} />)
    
    const usernameInput = screen.getByPlaceholderText('Digite seu usuário')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha')
    
    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, 'admin')
    await user.click(screen.getByRole('button', { name: /entrar/i }))
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(true)
    })
    
    // Form should be cleared after successful login
    expect(usernameInput).toHaveValue('')
    expect(passwordInput).toHaveValue('')
  })
})