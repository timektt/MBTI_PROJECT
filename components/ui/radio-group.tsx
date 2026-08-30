"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  children,
  className,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  indicatorClassName?: string
}) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer aspect-square h-4 w-4 shrink-0 rounded-full border border-white/30 text-[#f5c76d] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ba7eff]/40 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={cn("flex items-center justify-center", indicatorClassName)}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
      </RadioGroupPrimitive.Indicator>
      {children}
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
