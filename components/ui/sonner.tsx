"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
import '@/app/globals.css'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
     <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster"
      toastOptions={{
        classNames: {
          toast: "bg-[var(--backgroundSecondary)] text-[var(--popover-foreground)] border-[var(--border)] shadow-lg",
          description: "text-[var(--muted-foreground)]",
          actionButton: "bg-[var(--primary)] text-[var(--primary-foreground)]",
          cancelButton: "bg-[var(--muted)] text-[var(--muted-foreground)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }