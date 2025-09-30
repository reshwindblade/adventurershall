import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AvailabilityCalendar } from '@/Components/Booking/AvailabilityCalendar'

describe('AvailabilityCalendar Component', () => {
  const mockOnDateSelect = vi.fn()
  const mockOnTimeSelect = vi.fn()

  const defaultProps = {
    selectedDate: null,
    selectedTime: null,
    onDateSelect: mockOnDateSelect,
    onTimeSelect: mockOnTimeSelect,
    availableSlots: [
      { date: '2025-12-25', times: ['10:00', '14:00', '18:00'] },
      { date: '2025-12-26', times: ['12:00', '16:00'] },
    ],
  }

  beforeEach(() => {
    mockOnDateSelect.mockClear()
    mockOnTimeSelect.mockClear()
  })

  test('renders calendar with available dates', () => {
    render(<AvailabilityCalendar {...defaultProps} />)
    
    expect(screen.getByText('December 2025')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('26')).toBeInTheDocument()
  })

  test('handles date selection', async () => {
    const user = userEvent.setup()
    
    render(<AvailabilityCalendar {...defaultProps} />)
    
    await user.click(screen.getByText('25'))
    
    expect(mockOnDateSelect).toHaveBeenCalledWith('2025-12-25')
  })

  test('displays available time slots when date is selected', () => {
    const props = {
      ...defaultProps,
      selectedDate: '2025-12-25',
    }
    
    render(<AvailabilityCalendar {...props} />)
    
    expect(screen.getByText('10:00 AM')).toBeInTheDocument()
    expect(screen.getByText('2:00 PM')).toBeInTheDocument()
    expect(screen.getByText('6:00 PM')).toBeInTheDocument()
  })

  test('handles time slot selection', async () => {
    const user = userEvent.setup()
    const props = {
      ...defaultProps,
      selectedDate: '2025-12-25',
    }
    
    render(<AvailabilityCalendar {...props} />)
    
    await user.click(screen.getByText('2:00 PM'))
    
    expect(mockOnTimeSelect).toHaveBeenCalledWith('14:00')
  })

  test('highlights selected date', () => {
    const props = {
      ...defaultProps,
      selectedDate: '2025-12-25',
    }
    
    render(<AvailabilityCalendar {...props} />)
    
    const selectedDate = screen.getByText('25')
    expect(selectedDate).toHaveClass('bg-primary-500', 'text-white')
  })

  test('highlights selected time slot', () => {
    const props = {
      ...defaultProps,
      selectedDate: '2025-12-25',
      selectedTime: '14:00',
    }
    
    render(<AvailabilityCalendar {...props} />)
    
    const selectedTime = screen.getByText('2:00 PM')
    expect(selectedTime).toHaveClass('bg-primary-500', 'text-white')
  })

  test('disables unavailable dates', () => {
    render(<AvailabilityCalendar {...defaultProps} />)
    
    // Date 24 should be disabled (not in availableSlots)
    const unavailableDate = screen.getByText('24')
    expect(unavailableDate).toHaveClass('text-gray-400', 'cursor-not-allowed')
  })

  test('prevents selection of past dates', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1)
    
    const props = {
      ...defaultProps,
      availableSlots: [
        { 
          date: pastDate.toISOString().split('T')[0], 
          times: ['10:00'] 
        },
      ],
    }
    
    render(<AvailabilityCalendar {...props} />)
    
    const pastDateElement = screen.getByText(pastDate.getDate().toString())
    expect(pastDateElement).toHaveClass('text-gray-400', 'cursor-not-allowed')
  })

  test('navigates between months', async () => {
    const user = userEvent.setup()
    
    render(<AvailabilityCalendar {...defaultProps} />)
    
    const nextButton = screen.getByLabelText(/next month/i)
    await user.click(nextButton)
    
    expect(screen.getByText('January 2026')).toBeInTheDocument()
    
    const prevButton = screen.getByLabelText(/previous month/i)
    await user.click(prevButton)
    
    expect(screen.getByText('December 2025')).toBeInTheDocument()
  })

  test('shows no available times message when date has no slots', () => {
    const props = {
      ...defaultProps,
      selectedDate: '2025-12-27', // Date not in availableSlots
    }
    
    render(<AvailabilityCalendar {...props} />)
    
    expect(screen.getByText('No available time slots for this date')).toBeInTheDocument()
  })

  test('formats time slots correctly', () => {
    const props = {
      ...defaultProps,
      selectedDate: '2025-12-25',
    }
    
    render(<AvailabilityCalendar {...props} />)
    
    // Check 24-hour to 12-hour conversion
    expect(screen.getByText('10:00 AM')).toBeInTheDocument()
    expect(screen.getByText('2:00 PM')).toBeInTheDocument()
    expect(screen.getByText('6:00 PM')).toBeInTheDocument()
  })

  test('handles empty available slots', () => {
    const props = {
      ...defaultProps,
      availableSlots: [],
    }
    
    render(<AvailabilityCalendar {...props} />)
    
    expect(screen.getByText('No available dates')).toBeInTheDocument()
  })

  test('shows loading state', () => {
    const props = {
      ...defaultProps,
      loading: true,
    }
    
    render(<AvailabilityCalendar {...props} />)
    
    expect(screen.getByText('Loading availability...')).toBeInTheDocument()
  })

  test('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(<AvailabilityCalendar {...defaultProps} />)
    
    const date25 = screen.getByText('25')
    date25.focus()
    
    await user.keyboard('{Enter}')
    expect(mockOnDateSelect).toHaveBeenCalledWith('2025-12-25')
    
    await user.keyboard('{Space}')
    expect(mockOnDateSelect).toHaveBeenCalledTimes(2)
  })
})