export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    email_verified_at?: string;
    is_admin: boolean;
    google_id?: string;
    facebook_id?: string;
    created_at: string;
    updated_at: string;
}

export interface Room {
    id: number;
    name: string;
    slug: string;
    description: string;
    capacity: number;
    hourly_rate: number;
    image_path?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface RoomBooking {
    id: number;
    user_id: number;
    room_id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    total_cost: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    special_requests?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    room?: Room;
}

export interface Session {
    id: number;
    name: string;
    system: string;
    description: string;
    duration: number;
    max_participants: number;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SessionBooking {
    id: number;
    user_id: number;
    session_id: number;
    booking_date: string;
    start_time: string;
    participants: number;
    experience_level: 'none' | 'beginner' | 'intermediate' | 'advanced';
    special_requests?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
    updated_at: string;
    user?: User;
    session?: Session;
}

export interface ContactInquiry {
    id: number;
    name: string;
    email: string;
    message: string;
    status: 'new' | 'in_progress' | 'resolved';
    admin_notes?: string;
    created_at: string;
    updated_at: string;
}

export interface NewsArticle {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    is_published: boolean;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time?: string;
    location?: string;
    max_participants?: number;
    registration_required: boolean;
    featured_image?: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface Page {
    id: number;
    slug: string;
    title: string;
    content: string;
    meta_description?: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    auth: {
        user: User | null;
    };
    flash: {
        message?: string;
        error?: string;
    };
    errors: Record<string, string>;
} & T

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}