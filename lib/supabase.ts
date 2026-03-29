import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing Supabase environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        lockAcquireTimeout: -1,
    },
})

// Database types
export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
                    id: number
                    title: string
                    slug: string
                    category: string
                    technology: string[]
                    description: string
                    long_description: string | null
                    challenge: string | null
                    solution: string | null
                    results: string[]
                    features: string[]
                    images: ProjectImage[]
                    duration: string | null
                    team_size: number
                    client_type: string | null
                    live_url: string | null
                    github_url: string | null
                    is_published: boolean
                    is_featured: boolean
                    created_at: string
                    updated_at: string
                    testimonial: ProjectTestimonial | null
                    mobile_image: string | null
                    client_description: string | null
                    business_outcome: string | null
                    before_items: string[]
                    after_items: string[]
                }
                Insert: {
                    title: string
                    slug: string
                    category: string
                    technology: string[]
                    description: string
                    long_description?: string | null
                    challenge?: string | null
                    solution?: string | null
                    results?: string[]
                    features?: string[]
                    images?: ProjectImage[]
                    duration?: string | null
                    team_size?: number
                    client_type?: string | null
                    live_url?: string | null
                    github_url?: string | null
                    is_published?: boolean
                    is_featured?: boolean
                    testimonial?: ProjectTestimonial | null
                    mobile_image?: string | null
                    client_description?: string | null
                    business_outcome?: string | null
                    before_items?: string[]
                    after_items?: string[]
                }
                Update: {
                    title?: string
                    slug?: string
                    category?: string
                    technology?: string[]
                    description?: string
                    long_description?: string | null
                    challenge?: string | null
                    solution?: string | null
                    results?: string[]
                    features?: string[]
                    images?: ProjectImage[]
                    duration?: string | null
                    team_size?: number
                    client_type?: string | null
                    live_url?: string | null
                    github_url?: string | null
                    is_published?: boolean
                    is_featured?: boolean
                    testimonial?: ProjectTestimonial | null
                    mobile_image?: string | null
                    client_description?: string | null
                    business_outcome?: string | null
                    before_items?: string[]
                    after_items?: string[]
                }
            }
            blog_posts: {
                Row: {
                    id: number
                    title: string
                    slug: string
                    excerpt: string
                    content: string
                    images: ProjectImage[]
                    image_prompts: string[] | null
                    tags: string[]
                    author: string
                    date: string
                    is_published: boolean
                    created_at: string
                    updated_at: string
                    seo_title: string | null
                    seo_description: string | null
                    faqs: BlogFAQ[] | null
                    cta: BlogCTA | null
                }
                Insert: {
                    title: string
                    slug: string
                    excerpt: string
                    content: string
                    images?: ProjectImage[]
                    image_prompts?: string[] | null
                    tags?: string[]
                    author?: string
                    date?: string
                    is_published?: boolean
                    seo_title?: string | null
                    seo_description?: string | null
                    faqs?: BlogFAQ[] | null
                    cta?: BlogCTA | null
                }
                Update: {
                    title?: string
                    slug?: string
                    excerpt?: string
                    content?: string
                    images?: ProjectImage[]
                    image_prompts?: string[] | null
                    tags?: string[]
                    author?: string
                    date?: string
                    is_published?: boolean
                    seo_title?: string | null
                    seo_description?: string | null
                    faqs?: BlogFAQ[] | null
                    cta?: BlogCTA | null
                }
            }
            client_reviews: {
                Row: {
                    id: number
                    client_name: string | null
                    client_position: string | null
                    client_company: string | null
                    client_image: string | null
                    review_text: string
                    rating: number
                    project_category: string | null
                    testimonial_type: "identified" | "anonymous"
                    is_featured: boolean
                    is_published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    client_name?: string | null
                    client_position?: string | null
                    client_company?: string | null
                    client_image?: string | null
                    review_text: string
                    rating?: number
                    project_category?: string | null
                    testimonial_type?: "identified" | "anonymous"
                    is_featured?: boolean
                    is_published?: boolean
                }
                Update: {
                    client_name?: string | null
                    client_position?: string | null
                    client_company?: string | null
                    client_image?: string | null
                    review_text?: string
                    rating?: number
                    project_category?: string | null
                    testimonial_type?: "identified" | "anonymous"
                    is_featured?: boolean
                    is_published?: boolean
                }
            }
            blog_comments: {
                Row: {
                    id: number
                    post_slug: string
                    name: string
                    email: string
                    website: string | null
                    content: string
                    is_approved: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    post_slug: string
                    name: string
                    email: string
                    website?: string | null
                    content: string
                    is_approved?: boolean
                }
                Update: {
                    post_slug?: string
                    name?: string
                    email?: string
                    website?: string | null
                    content?: string
                    is_approved?: boolean
                }
            }
            trusted_partners: {
                Row: {
                    id: number
                    company_name: string
                    company_logo: string
                    company_website: string | null
                    partnership_type: string | null
                    description: string | null
                    is_featured: boolean
                    is_published: boolean
                    display_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    company_name: string
                    company_logo: string
                    company_website?: string | null
                    partnership_type?: string | null
                    description?: string | null
                    is_featured?: boolean
                    is_published?: boolean
                    display_order?: number
                }
                Update: {
                    company_name?: string
                    company_logo?: string
                    company_website?: string | null
                    partnership_type?: string | null
                    description?: string | null
                    is_featured?: boolean
                    is_published?: boolean
                    display_order?: number
                }
            }
        }
    }
}

export interface ProjectImage {
    id: number
    url: string
    alt: string
    caption?: string
}

export interface ProjectTestimonial {
    quote: string
    author: string
    position: string
    company: string
}

export interface BlogFAQ {
    question: string
    answer: string
}

export interface BlogCTA {
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
}

export type ProjectDetail = Database["public"]["Tables"]["projects"]["Row"]
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"]
export type ClientReview = Database["public"]["Tables"]["client_reviews"]["Row"]
export type TrustedPartner = Database["public"]["Tables"]["trusted_partners"]["Row"]
export type BlogComment = Database["public"]["Tables"]["blog_comments"]["Row"]
