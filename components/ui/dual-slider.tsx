"use client"

import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {useEffect, useState} from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

const DualSlider = ({
                      minField,
                      maxField,
                      label,
                      min,
                      max,
                      step = 1,
                      className,
                    }: {
  minField: any
  maxField: any
  label: string
  min: number
  max: number
  step?: number
  className?: string
}) => {
  const [values, setValues] = useState<number[]>([minField.value, maxField.value])

  // Update internal state when form values change externally
  useEffect(() => {
    setValues([minField.value, maxField.value])
  }, [minField.value, maxField.value])

  const handleChange = (newValues: number[]) => {
    setValues(newValues)
    minField.onChange(newValues[0]) // Update min value
    maxField.onChange(newValues[1]) // Update max value
  }

  return (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <SliderPrimitive.Root
              className="relative flex w-full touch-none select-none items-center"
              min={min}
              max={max}
              step={step}
              value={values}
              onValueChange={handleChange}
              aria-label={label}
          >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
              <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            {values.map((_, index) => (
                <SliderPrimitive.Thumb
                    key={index}
                    className="block size-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                />
            ))}
          </SliderPrimitive.Root>
        </FormControl>
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>{values[0]}</span>
          <span>{values[1]}</span>
        </div>
        <FormMessage />
      </FormItem>
  )
}

export { DualSlider }

