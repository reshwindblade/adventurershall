import '@testing-library/jest-dom'

// Mock InertiaJS
global.route = vi.fn((name: string, params?: any) => {
  return `/${name.replace('.', '/')}${params ? `/${params}` : ''}`
})

// Mock window.route function
Object.defineProperty(window, 'route', {
  value: global.route,
  writable: true,
})

// Mock Inertia router
vi.mock('@inertiajs/react', async () => {
  const actual = await vi.importActual('@inertiajs/react')
  return {
    ...actual,
    router: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      reload: vi.fn(),
      visit: vi.fn(),
    },
    usePage: vi.fn(() => ({
      props: {
        auth: {
          user: null,
        },
        errors: {},
        flash: {},
      },
      url: '/',
      component: 'Home',
    })),
  }
})