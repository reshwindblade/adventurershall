import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/Components/UI/Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  test('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies primary variant styles', () => {
    render(<Button variant="primary">Primary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary-500')
  })

  test('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-200')
  })

  test('applies danger variant styles', () => {
    render(<Button variant="danger">Danger Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-500')
  })

  test('applies small size styles', () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
  })

  test('applies large size styles', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  test('shows loading state', () => {
    render(<Button loading>Loading Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders as link when href is provided', () => {
    render(<Button href="/test">Link Button</Button>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/test')
  })

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  test('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Ref Button</Button>)
    expect(ref).toHaveBeenCalled()
  })
})