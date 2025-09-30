import { 
  validateEmail, 
  validatePassword, 
  validateRequired, 
  validateDate, 
  validateTime,
  validateBookingData,
  formatValidationErrors 
} from '@/utils/validation'

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    test('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    test('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test.example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    test('validates strong passwords', () => {
      expect(validatePassword('Password123!')).toBe(true)
      expect(validatePassword('MySecure123')).toBe(true)
      expect(validatePassword('Complex@Pass1')).toBe(true)
    })

    test('rejects weak passwords', () => {
      expect(validatePassword('weak')).toBe(false) // Too short
      expect(validatePassword('password')).toBe(false) // No uppercase/numbers
      expect(validatePassword('PASSWORD')).toBe(false) // No lowercase/numbers
      expect(validatePassword('12345678')).toBe(false) // No letters
      expect(validatePassword('')).toBe(false) // Empty
    })

    test('validates minimum length requirement', () => {
      expect(validatePassword('Pass123', 8)).toBe(false) // 7 chars, min 8
      expect(validatePassword('Password123', 8)).toBe(true) // 11 chars, min 8
    })
  })

  describe('validateRequired', () => {
    test('validates non-empty values', () => {
      expect(validateRequired('test')).toBe(true)
      expect(validateRequired('0')).toBe(true)
      expect(validateRequired(0)).toBe(true)
      expect(validateRequired(false)).toBe(true)
    })

    test('rejects empty values', () => {
      expect(validateRequired('')).toBe(false)
      expect(validateRequired('   ')).toBe(false) // Whitespace only
      expect(validateRequired(null)).toBe(false)
      expect(validateRequired(undefined)).toBe(false)
    })
  })

  describe('validateDate', () => {
    test('validates future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]
      
      expect(validateDate(tomorrowStr)).toBe(true)
    })

    test('rejects past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      expect(validateDate(yesterdayStr)).toBe(false)
    })

    test('rejects invalid date formats', () => {
      expect(validateDate('invalid-date')).toBe(false)
      expect(validateDate('2025-13-01')).toBe(false) // Invalid month
      expect(validateDate('2025-02-30')).toBe(false) // Invalid day
      expect(validateDate('')).toBe(false)
    })

    test('allows today when allowToday is true', () => {
      const today = new Date().toISOString().split('T')[0]
      
      expect(validateDate(today, true)).toBe(true)
      expect(validateDate(today, false)).toBe(false)
    })
  })

  describe('validateTime', () => {
    test('validates correct time formats', () => {
      expect(validateTime('09:00')).toBe(true)
      expect(validateTime('14:30')).toBe(true)
      expect(validateTime('23:59')).toBe(true)
      expect(validateTime('00:00')).toBe(true)
    })

    test('rejects invalid time formats', () => {
      expect(validateTime('25:00')).toBe(false) // Invalid hour
      expect(validateTime('12:60')).toBe(false) // Invalid minute
      expect(validateTime('9:00')).toBe(false) // Missing leading zero
      expect(validateTime('12:5')).toBe(false) // Missing leading zero
      expect(validateTime('invalid')).toBe(false)
      expect(validateTime('')).toBe(false)
    })

    test('validates time ranges', () => {
      expect(validateTime('09:00', '08:00', '18:00')).toBe(true)
      expect(validateTime('07:00', '08:00', '18:00')).toBe(false) // Before min
      expect(validateTime('19:00', '08:00', '18:00')).toBe(false) // After max
    })
  })

  describe('validateBookingData', () => {
    const validBookingData = {
      room_id: 1,
      booking_date: '2025-12-25',
      start_time: '14:00',
      end_time: '16:00',
    }

    test('validates correct booking data', () => {
      const result = validateBookingData(validBookingData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    test('validates required fields', () => {
      const result = validateBookingData({})
      expect(result.isValid).toBe(false)
      expect(result.errors.room_id).toBeDefined()
      expect(result.errors.booking_date).toBeDefined()
      expect(result.errors.start_time).toBeDefined()
      expect(result.errors.end_time).toBeDefined()
    })

    test('validates end time is after start time', () => {
      const invalidData = {
        ...validBookingData,
        start_time: '16:00',
        end_time: '14:00',
      }
      
      const result = validateBookingData(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.end_time).toContain('must be after start time')
    })

    test('validates booking date is in future', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const invalidData = {
        ...validBookingData,
        booking_date: yesterday.toISOString().split('T')[0],
      }
      
      const result = validateBookingData(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.booking_date).toContain('must be in the future')
    })

    test('validates minimum booking duration', () => {
      const invalidData = {
        ...validBookingData,
        start_time: '14:00',
        end_time: '14:15', // Only 15 minutes
      }
      
      const result = validateBookingData(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.end_time).toContain('minimum duration')
    })
  })

  describe('formatValidationErrors', () => {
    test('formats Laravel validation errors', () => {
      const laravelErrors = {
        'email': ['The email field is required.'],
        'password': ['The password must be at least 8 characters.', 'The password must contain at least one number.'],
      }
      
      const formatted = formatValidationErrors(laravelErrors)
      
      expect(formatted.email).toBe('The email field is required.')
      expect(formatted.password).toBe('The password must be at least 8 characters.')
    })

    test('handles empty errors object', () => {
      const formatted = formatValidationErrors({})
      expect(formatted).toEqual({})
    })

    test('handles single string errors', () => {
      const errors = {
        'general': 'Something went wrong',
      }
      
      const formatted = formatValidationErrors(errors)
      expect(formatted.general).toBe('Something went wrong')
    })
  })
})