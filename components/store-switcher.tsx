"use client";
import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon} from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useStoreModal } from "@/hooks/use-store-modal";


type PopoverTriggerProps=React.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface StoreSwitcherProps extends PopoverTriggerProps{
    items:Store[]
}

export default function StoreSwitcher({
    className,
    items=[]
}:StoreSwitcherProps){
    const params=useParams();
    const router=useRouter();
    const storeModal=useStoreModal();
    const [open,setOpen]=useState(false);
    const formatedItem=items.map((item)=>({
        label:item.name,
        value:item.id,
    }));
    const currentItem=formatedItem.find((item)=>(item.value===params.storeId));
    const onSelectedItem=(item:{label:string,value:string})=>{
        setOpen(false);
        router.push(`/${item.value}`);
    }
    return(
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={open}
                aria-label="Select a store"
                className={cn(`w-[200px] justify-between truncate`, className)}
                >  
                <StoreIcon className="h-4 w-4 mr-2" />
                {currentItem?.label}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search store..."/>
                    <CommandList>
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="store">
                            {formatedItem.map((item)=>(
                                <CommandItem
                                    className="text-sm"
                                    key={item.value}
                                    onSelect={()=>onSelectedItem(item)}
                                >
                                    <StoreIcon className="mr-2 h-4 w-4"/>
                                    {item.label}
                                    <Check className={cn(`ml-auto h-4 w-4`,
                                        currentItem?.value==item.value?"opacity-100":"opacity-0"
                                    )}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={()=>{
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                            >
                                <PlusCircle className="h-5 w-5 mr-2"/>
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}