import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format, setYear, setMonth, getDaysInMonth, startOfMonth, getDay } from "date-fns"

interface CustomDatePickerProps {
  selectedDate: Date | null
  onDateChange: (date: Date) => void
}

export function CustomDatePicker({ selectedDate, onDateChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(selectedDate || today)

  const years = Array.from({ length: 30 }, (_, i) => today.getFullYear() - i)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleYearChange = (year: string) => {
    const newDate = setYear(currentDate, parseInt(year))
    setCurrentDate(newDate)
  }

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(currentDate, months.indexOf(month))
    setCurrentDate(newDate)
  }

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onDateChange(newDate)
    setIsOpen(false)
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getDay(startOfMonth(currentDate))
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="flex space-x-2">
            <Select onValueChange={handleYearChange} value={currentDate.getFullYear().toString()}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleMonthChange} value={months[currentDate.getMonth()]}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-muted-foreground text-sm">
                {day}
              </div>
            ))}
            {Array(firstDayOfMonth).fill(null).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {days.map((day) => (
              <Button
                key={day}
                variant="ghost"
                className="h-8 w-8 p-0 font-normal"
                onClick={() => handleDayClick(day)}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
