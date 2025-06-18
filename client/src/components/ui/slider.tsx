import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full select-none items-center py-4",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-slate-200">
      <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-blue-600 bg-white shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-110 active:scale-95" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
