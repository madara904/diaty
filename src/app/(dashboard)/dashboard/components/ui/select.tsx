import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/app/components/ui/select";

import React from 'react'

interface SelectorProps {
    triggerValue: string,
    label: string,
    items: string[]
}


const Selector = ( {triggerValue, label, items}: SelectorProps ) => {


    
  return (
    
<Select>
<SelectTrigger className="w-[180px]" aria-disabled>
  <SelectValue placeholder={triggerValue} />
</SelectTrigger>
<SelectContent>
  <SelectGroup>
    <SelectLabel>{label}</SelectLabel>
    {
                items.map((item, i) => (
                    <div key={i} >
                        <SelectItem value={item}>{item}</SelectItem>
                    </div>
                ))
            }
  </SelectGroup>
</SelectContent>
</Select>
  )
}

export default Selector

