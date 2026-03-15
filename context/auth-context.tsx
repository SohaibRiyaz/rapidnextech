"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  failedAttempts: number
  lockoutUntil: number | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isLockedOut: boolean
  lockoutTimeRemaining: number
  formatLockoutTime: (ms: number) => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    failedAttempts: 0,
    lockoutUntil: null,
  })

  // Initialize auth state - only once
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason: any = event.reason
      const message = typeof reason?.message === "string" ? reason.message : ""
      const stack = typeof reason?.stack === "string" ? reason.stack : ""
      const isSupabaseLockError =
        reason?.isAcquireTimeout === true ||
        (reason?.name === "AbortError" && (message.toLowerCase().includes("lock") || stack.includes("locks.js")))
      if (isSupabaseLockError) {
        event.preventDefault()
      }
    }
    const handleWindowError = (event: ErrorEvent) => {
      const error: any = event.error
      const message = typeof error?.message === "string" ? error.message : ""
      const stack = typeof error?.stack === "string" ? error.stack : ""
      const isSupabaseLockError =
        error?.isAcquireTimeout === true ||
        (error?.name === "AbortError" && (message.toLowerCase().includes("lock") || stack.includes("locks.js")))
      if (isSupabaseLockError) {
        event.preventDefault()
      }
    }
    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleWindowError)

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      }))
    }).catch(err => {
      console.error('Error getting initial session:', err)
      setAuthState(prev => ({ ...prev, isLoading: false }))
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      }))
    })

    // Load failed attempts from localStorage
    const savedFailedAttempts = localStorage.getItem("admin_failed_attempts")
    const savedLockout = localStorage.getItem("admin_lockout")
    
    if (savedFailedAttempts) {
      const attempts = parseInt(savedFailedAttempts, 10)
      setAuthState(prev => ({ ...prev, failedAttempts: attempts }))
    }
    
    if (savedLockout) {
      const lockoutEnd = parseInt(savedLockout, 10)
      if (Date.now() < lockoutEnd) {
        setAuthState(prev => ({ ...prev, lockoutUntil: lockoutEnd }))
      } else {
        localStorage.removeItem("admin_lockout")
        localStorage.removeItem("admin_failed_attempts")
      }
    }

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleWindowError)
    }
  }, []) // Empty dependency array - only run once

  // Clear lockout timer
  useEffect(() => {
    if (authState.lockoutUntil) {
      const interval = setInterval(() => {
        if (Date.now() >= authState.lockoutUntil!) {
          setAuthState(prev => ({ ...prev, lockoutUntil: null, failedAttempts: 0 }))
          localStorage.removeItem("admin_lockout")
          localStorage.removeItem("admin_failed_attempts")
        }
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [authState.lockoutUntil])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const now = Date.now()

    // Check if locked out
    if (authState.lockoutUntil && now < authState.lockoutUntil) {
      const remainingMs = authState.lockoutUntil - now
      const minutes = Math.ceil(remainingMs / 60000)
      return { success: false, error: `Account locked. Try again in ${minutes} minutes.` }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Handle failed login
        const newFailedAttempts = authState.failedAttempts + 1
        const shouldLockout = newFailedAttempts >= MAX_ATTEMPTS
        
        setAuthState(prev => ({
          ...prev,
          failedAttempts: newFailedAttempts,
          lockoutUntil: shouldLockout ? now + LOCKOUT_DURATION : null,
        }))
        
        // Persist to localStorage
        localStorage.setItem("admin_failed_attempts", newFailedAttempts.toString())
        if (shouldLockout) {
          localStorage.setItem("admin_lockout", (now + LOCKOUT_DURATION).toString())
        }
        
        if (shouldLockout) {
          return { success: false, error: "Too many failed attempts. Account locked for 15 minutes." }
        } else {
          const remaining = MAX_ATTEMPTS - newFailedAttempts
          return { success: false, error: `Invalid credentials. ${remaining} attempts remaining.` }
        }
      }

      // Success - clear failed attempts (but don't set auth state manually, let onAuthStateChange handle it)
      setAuthState(prev => ({
        ...prev,
        failedAttempts: 0,
        lockoutUntil: null,
      }))
      
      localStorage.removeItem("admin_failed_attempts")
      localStorage.removeItem("admin_lockout")
      
      return { success: true }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      failedAttempts: 0,
      lockoutUntil: null,
    })
  }

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const isLockedOut = authState.lockoutUntil ? Date.now() < authState.lockoutUntil : false
  const lockoutTimeRemaining = authState.lockoutUntil ? Math.max(0, authState.lockoutUntil - Date.now()) : 0

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    isLockedOut,
    lockoutTimeRemaining,
    formatLockoutTime: formatTime,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
