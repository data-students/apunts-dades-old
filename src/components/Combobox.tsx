import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"

export interface Option {
  value: string
  label: string
}
export function Combobox({
  options,
  value,
  setValue,
}: {
  options: Option[]
  value: string
  setValue: Function
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-80 justify-between"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : "Selecciona..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-80 flex flex-col w-80 p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty className="flex-1">
              No s&apos;han trobat resultats.
            </CommandEmpty>
            <CommandGroup className="flex-1 h-full overflow-y-scroll">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
