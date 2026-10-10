"use client"

import { useState, useRef, useEffect } from "react"
import { useThemeContext, type ThemeColor } from "@/context/theme-context"
import { Button } from "./ui/button"
import { Moon, Sun, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeSwitcher() {
  const { mode, color, setMode, setColor } = useThemeContext()
  const [showColorPicker, setShowColorPicker] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  const colors = [
    { name: "blue", label: "Blue", bgClass: "bg-blue-500" },
    { name: "green", label: "Green", bgClass: "bg-emerald-500" },
    { name: "purple", label: "Purple", bgClass: "bg-purple-500" },
    { name: "red", label: "Red", bgClass: "bg-red-500" },
    { name: "orange", label: "Orange", bgClass: "bg-orange-500" },
    { name: "white", label: "White", bgClass: "bg-white border border-gray-200" },
    { name: "black", label: "Black", bgClass: "bg-black" },
  ]

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get button styles based on theme
  const getButtonStyle = () => {
    if (color === "white" && mode === "light") {
      return "border border-gray-300 bg-white/80 text-gray-800 hover:bg-gray-100"
    } else if (color === "black" || mode === "dark") {
      return "bg-gray-800/80 text-white hover:bg-gray-700"
    } else {
      return ""
    }
  }

  return (
    <div className="relative" ref={colorPickerRef}>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          aria-label="Toggle theme mode"
          className={`h-11 w-11 rounded-full ${getButtonStyle()}`}
        >
          {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowColorPicker(!showColorPicker)}
          aria-label="Change theme color"
          className={`h-11 w-11 rounded-full ${getButtonStyle()}`}
        >
          <Palette className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 p-3 ${color === "white" && mode === "light"
              ? "bg-white border border-gray-300"
              : "bg-background border border-border"
              } rounded-lg shadow-lg z-50 w-64`}
          >
            <h3 className="text-sm font-medium mb-2 theme-text">Choose Theme</h3>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((themeColor) => (
                <button
                  key={themeColor.name}
                  className={`w-12 h-12 rounded-full ${color === themeColor.name ? "ring-2 ring-primary" : ""
                    } ${themeColor.bgClass} flex items-center justify-center transition-transform hover:scale-110`}
                  onClick={() => {
                    setColor(themeColor.name as ThemeColor)
                    setShowColorPicker(false)
                  }}
                  aria-label={`Set theme color to ${themeColor.label}`}
                  title={themeColor.label}
                >
                  {color === themeColor.name && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-3 h-3 rounded-full ${themeColor.name === "white" ? "bg-black" : "bg-white"}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
