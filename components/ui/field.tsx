"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function FieldSet({
  className,
  ...props
}: React.ComponentProps<"fieldset">) {
  return <fieldset className={cn("grid gap-4", className)} {...props} />
}

function FieldLegend({
  className,
  ...props
}: React.ComponentProps<"legend">) {
  return (
    <legend
      className={cn("font-code text-[11px] uppercase tracking-[0.22em] text-white/48", className)}
      {...props}
    />
  )
}

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "vertical" | "horizontal" | "responsive"
}) {
  return (
    <div
      role="group"
      className={cn(
        "grid gap-3",
        orientation === "horizontal" && "grid-cols-[auto_1fr] items-start gap-4",
        orientation === "responsive" && "grid gap-4 md:grid-cols-[auto_1fr] md:items-start",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-sm font-medium leading-6 text-white/82 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("grid gap-2", className)} {...props} />
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("text-sm leading-7 text-white/60", className)} {...props} />
}

function FieldError({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("text-sm leading-6 text-[#ffb4a8]", className)} {...props} />
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
}
