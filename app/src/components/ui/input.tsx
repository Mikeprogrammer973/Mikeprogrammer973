import { cn } from "mdp/lib/utils"
import React from "react"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
        <input
        ref={ref}
        className={cn(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            className
        )}
        {...props}
        />
    )
})

Input.displayName = "Input"

export { Input }