import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/Components/UI/Input'

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Email" name="email" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  test('handles value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input label="Email" name="email" onChange={handleChange} />)
    const input = screen.getByLabelText(/email/i)
    
    await user.type(input, 'test@example.com')
    expect(handleChange).toHaveBeenCalled()
  })

  test('displays error message', () => {
    render(<Input label="Email" name="email" error="Email is required" />)
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toHaveClass('border-red-500')
  })

  test('applies error styles when error is present', () => {
    render(<Input label="Email" name="email" error="Invalid email" />)
    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveClass('border-red-500', 'focus:border-red-500')
  })

  test('renders different input types', () => {
    const { rerender } = render(<Input label="Password" name="password" type="password" />)
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password')

    rerender(<Input label="Email" name="email" type="email" />)
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email')

    rerender(<Input label="Number" name="number" type="number" />)
    expect(screen.getByLabelText(/number/i)).toHaveAttribute('type', 'number')
  })

  test('renders with placeholder', () => {
    render(<Input label="Email" name="email" placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  test('handles disabled state', () => {
    render(<Input label="Email" name="email" disabled />)
    const input = screen.getByLabelText(/email/i)
    expect(input).toBeDisabled()
    expect(input).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  test('handles required field', () => {
    render(<Input label="Email" name="email" required />)
    const input = screen.getByLabelText(/email/i)
    expect(input).toBeRequired()
    expect(screen.getByText(/email/i)).toHaveTextContent('*')
  })

  test('renders help text', () => {
    render(<Input label="Password" name="password" help="Must be at least 8 characters" />)
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    render(<Input label="Email" name="email" className="custom-input" />)
    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveClass('custom-input')
  })

  test('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} label="Email" name="email" />)
    expect(ref).toHaveBeenCalled()
  })

  test('handles focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    
    render(<Input label="Email" name="email" onFocus={handleFocus} onBlur={handleBlur} />)
    const input = screen.getByLabelText(/email/i)
    
    await user.click(input)
    expect(handleFocus).toHaveBeenCalled()
    
    await user.tab()
    expect(handleBlur).toHaveBeenCalled()
  })

  test('renders with default value', () => {
    render(<Input label="Email" name="email" defaultValue="test@example.com" />)
    const input = screen.getByLabelText(/email/i) as HTMLInputElement
    expect(input.value).toBe('test@example.com')
  })
})