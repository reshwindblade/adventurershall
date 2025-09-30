import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ValidatedForm } from '@/Components/Forms/ValidatedForm'

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

describe('ValidatedForm Component', () => {
  beforeEach(() => {
    mockPost.mockClear()
  })

  test('renders form with children', () => {
    render(
      <ValidatedForm action="/test" method="post">
        <input name="test" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    )
    
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  test('handles form submission', async () => {
    const user = userEvent.setup()
    
    render(
      <ValidatedForm action="/test" method="post">
        <input name="email" defaultValue="test@example.com" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    )
    
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(mockPost).toHaveBeenCalledWith('/test', expect.objectContaining({
      email: 'test@example.com'
    }), expect.any(Object))
  })

  test('displays validation errors', () => {
    const errors = { email: 'Email is required' }
    
    render(
      <ValidatedForm action="/test" method="post" errors={errors}>
        <input name="email" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    )
    
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  test('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    render(
      <ValidatedForm action="/test" method="post">
        <input name="email" defaultValue="test@example.com" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    )
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)
    
    expect(submitButton).toBeDisabled()
  })

  test('prevents multiple submissions', async () => {
    const user = userEvent.setup()
    
    render(
      <ValidatedForm action="/test" method="post">
        <input name="email" defaultValue="test@example.com" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    )
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    
    // Click multiple times rapidly
    await user.click(submitButton)
    await user.click(submitButton)
    await user.click(submitButton)
    
    // Should only be called once
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  test('handles client-side validation', async () => {
    const user = userEvent.setup()
    
    render(
      <ValidatedForm action="/test" method="post">
        <input name="email" type="email" required />
        <button type="submit">Submit</button>
      </ValidatedForm>
    )
    
    const emailInput = screen.getByRole('textbox')
    await user.type(emailInput, 'invalid-email')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Form should not submit with invalid email
    expect(mockPost).not.toHaveBeenCalled()
  })

  test('clears errors on successful submission', async () => {
    const user = userEvent.setup()
    const errors = { email: 'Email is required' }
    
    const { rerender } = render(
      <ValidatedForm action="/test" method="post" errors={errors}>
        <input name="email" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    )
    
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    
    // Simulate successful submission by removing errors
    rerender(
      <ValidatedForm action="/test" method="post" errors={{}}>
        <input name="email" defaultValue="test@example.com" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    )
    
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
  })

  test('handles different HTTP methods', async () => {
    const user = userEvent.setup()
    
    render(
      <ValidatedForm action="/test" method="put">
        <input name="name" defaultValue="Test Name" />
        <button type="submit">Update</button>
      </ValidatedForm>
    )
    
    await user.click(screen.getByRole('button', { name: /update/i }))
    
    expect(mockPost).toHaveBeenCalledWith('/test', expect.objectContaining({
      name: 'Test Name',
      _method: 'put'
    }), expect.any(Object))
  })

  test('includes CSRF token in form data', async () => {
    const user = userEvent.setup()
    
    // Mock CSRF token
    const csrfToken = 'test-csrf-token'
    const metaElement = document.createElement('meta')
    metaElement.name = 'csrf-token'
    metaElement.content = csrfToken
    document.head.appendChild(metaElement)
    
    render(
      <ValidatedForm action="/test" method="post">
        <input name="test" defaultValue="value" />
        <button type="submit">Submit</button>
      </ValidatedForm>
    )
    
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(mockPost).toHaveBeenCalledWith('/test', expect.objectContaining({
      _token: csrfToken
    }), expect.any(Object))
    
    // Cleanup
    document.head.removeChild(metaElement)
  })
})