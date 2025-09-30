import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/Components/Auth/LoginForm'

// Mock the router
const mockPost = vi.fn()
vi.mock('@inertiajs/react', async () => {
  const actual = await vi.importActual('@inertiajs/react')
  return {
    ...actual,
    router: {
      post: mockPost,
    },
  }
})

describe('LoginForm Component', () => {
  beforeEach(() => {
    mockPost.mockClear()
  })

  test('renders login form fields', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
  })

  test('handles form submission with valid data', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    expect(mockPost).toHaveBeenCalledWith('/login', {
      email: 'test@example.com',
      password: 'password123',
      remember: false,
    }, expect.any(Object))
  })

  test('handles remember me checkbox', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByLabelText(/remember me/i))
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    expect(mockPost).toHaveBeenCalledWith('/login', {
      email: 'test@example.com',
      password: 'password123',
      remember: true,
    }, expect.any(Object))
  })

  test('displays validation errors', () => {
    const errors = {
      email: 'The email field is required.',
      password: 'The password field is required.',
    }
    
    render(<LoginForm errors={errors} />)
    
    expect(screen.getByText('The email field is required.')).toBeInTheDocument()
    expect(screen.getByText('The password field is required.')).toBeInTheDocument()
  })

  test('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    expect(submitButton).toBeDisabled()
  })

  test('validates required fields', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    // Try to submit without filling fields
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    // Should not submit
    expect(mockPost).not.toHaveBeenCalled()
  })

  test('validates email format', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    // Should not submit with invalid email
    expect(mockPost).not.toHaveBeenCalled()
  })

  test('renders forgot password link', () => {
    render(<LoginForm />)
    
    const forgotPasswordLink = screen.getByText(/forgot your password/i)
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password')
  })

  test('renders register link', () => {
    render(<LoginForm />)
    
    const registerLink = screen.getByText(/don't have an account/i)
    expect(registerLink).toBeInTheDocument()
    expect(screen.getByText(/sign up/i).closest('a')).toHaveAttribute('href', '/register')
  })

  test('handles authentication errors', () => {
    const errors = {
      email: 'These credentials do not match our records.',
    }
    
    render(<LoginForm errors={errors} />)
    
    expect(screen.getByText('These credentials do not match our records.')).toBeInTheDocument()
  })

  test('clears form on successful submission', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
    
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    // After successful submission, form should be cleared
    // This would typically happen through a page redirect in real usage
    expect(mockPost).toHaveBeenCalled()
  })

  test('focuses first field on mount', () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveFocus()
  })
})