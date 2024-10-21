"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format, setYear, setMonth, getDaysInMonth, startOfMonth, getDay } from "date-fns"


interface CustomDatePickerProps {
  selectedDate: Date | null
  onDateChange: (date: Date) => void
}

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const YearSelect = React.memo(({ currentYear, onYearChange }: { currentYear: number, onYearChange: (year: string) => void }) => (
  <Select onValueChange={onYearChange} value={currentYear.toString()}>
    <SelectTrigger className="w-[120px]">
      <SelectValue placeholder="Year" />
    </SelectTrigger>
    <SelectContent>
      {YEARS.map((year) => (
        <SelectItem key={year} value={year.toString()}>
          {year}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
))
YearSelect.displayName = 'YearSelect'

const MonthSelect = React.memo(({ currentMonth, onMonthChange }: { currentMonth: number, onMonthChange: (month: string) => void }) => (
  <Select onValueChange={onMonthChange} value={MONTHS[currentMonth]}>
    <SelectTrigger className="w-[120px]">
      <SelectValue placeholder="Month" />
    </SelectTrigger>
    <SelectContent>
      {MONTHS.map((month) => (
        <SelectItem key={month} value={month}>
          {month}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
))
MonthSelect.displayName = 'MonthSelect'

export function CustomDatePicker({ selectedDate, onDateChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const today = useMemo(() => new Date(), [])
  const [currentDate, setCurrentDate] = useState(selectedDate || today)

  const handleYearChange = useCallback((year: string) => {
    setCurrentDate(prevDate => setYear(prevDate, parseInt(year)))
  }, [])

  const handleMonthChange = useCallback((month: string) => {
    setCurrentDate(prevDate => setMonth(prevDate, MONTHS.indexOf(month)))
  }, [])

  const handleDayClick = useCallback((day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onDateChange(newDate)
    setIsOpen(false)
  }, [currentDate, onDateChange])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { daysInMonth, firstDayOfMonth, days } = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getDay(startOfMonth(currentDate))
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    return { daysInMonth, firstDayOfMonth, days }
  }, [currentDate])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
          aria-label="Select date"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="flex space-x-2">
            <YearSelect currentYear={currentDate.getFullYear()} onYearChange={handleYearChange} />
            <MonthSelect currentMonth={currentDate.getMonth()} onMonthChange={handleMonthChange} />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center" role="grid" aria-label="Calendar">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-muted-foreground text-sm" role="columnheader">
                {day}
              </div>
            ))}
            {Array(firstDayOfMonth).fill(null).map((_, index) => (
              <div key={`empty-${index}`} role="gridcell" />
            ))}
            {days.map((day) => (
              <Button
                key={day}
                variant="ghost"
                className="h-8 w-8 p-0 font-normal"
                onClick={() => handleDayClick(day)}
                role="gridcell"
                aria-label={`Select ${format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), "PPP")}`}
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
