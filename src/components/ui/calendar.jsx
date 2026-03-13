import * as React from "react"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  formatters,
  components,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-white p-3", className)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: "w-fit",
        months: "relative flex flex-col gap-4 md:flex-row",
        month: "flex w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
        button_previous: "inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 disabled:opacity-50",
        button_next: "inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 disabled:opacity-50",
        month_caption: "flex h-8 w-full items-center justify-center px-8",
        caption_label: "text-xl font-medium select-none",
        dropdowns: "flex h-8 w-full items-center justify-center gap-2 text-xl font-medium",
        dropdown_root: "relative rounded-md border border-gray-200",
        dropdown: "absolute inset-0 opacity-0",
        table: "w-full border-collapse",
        weekdays: "flex",
        weekday: "flex-1 text-center text-xl text-gray-500 font-normal py-1 w-8",
        week: "flex w-full mt-1",
        day: "relative flex-1 flex items-center justify-center p-0 text-xl select-none",
        day_button: "h-8 w-8 flex items-center justify-center rounded-md hover:bg-[#050C9C] hover:text-white text-xl font-normal transition-colors",
        selected: "[&>button]:bg-[#050C9C] [&>button]:text-white",
        today: "[&>button]:font-semibold [&>button]:text-[#050C9C]",
        outside: "[&>button]:text-gray-300",
        disabled: "[&>button]:text-gray-300 [&>button]:opacity-50 [&>button]:cursor-not-allowed",
        hidden: "invisible",
        range_start: "[&>button]:bg-[#050C9C] [&>button]:text-white rounded-l-md",
        range_middle: "[&>button]:bg-[#050C9C] [&>button]:text-white rounded-none",
        range_end: "[&>button]:bg-[#050C9C] [&>button]:text-white rounded-r-md",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: cls, ...rest }) => {
          if (orientation === "left") return <ChevronLeftIcon className={cn("size-4", cls)} {...rest} />
          if (orientation === "right") return <ChevronRightIcon className={cn("size-4", cls)} {...rest} />
          return <ChevronDownIcon className={cn("size-4", cls)} {...rest} />
        },
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar }
