"use client";

import { store } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Label } from "@/components/ui/label";

import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/ui/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ApiAlert from "@/components/ui/api-alert";

interface SettingsFormsProps{
    initialData: store;
}

const formSchema=z.object({
    name:z.string().min(1),
})
type formSchemaValue=z.infer<typeof formSchema>;

const SettingsForms:React.FC<SettingsFormsProps>=({
    initialData
})=>{
    const params=useParams();
    const router=useRouter();
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false);
    const origin=useOrigin();

    const form=useForm<formSchemaValue>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name: initialData.name,
        },
    });
    const onSubmit=async(data:formSchemaValue)=>{
        try{
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`,data);
            router.refresh();
            toast.success("Store updated.");
        }catch(error){
            toast.error("Something went wrong");
        }finally{
            setLoading(false);
        }
    }
    const onDelete=async()=>{
        try{
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push("/");
            toast.success("Store deleted.");
        }catch(error){
            toast.error("Make sure you remove product and catagories first.")
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }
    return(
        <>
            <AlertModal 
                isOpen={open}
                onClose={()=>setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title="Settings"
                    description="Manage store preferences"
                    />
                <Button
                disabled={loading}
                variant="destructive"
                size="icon"
                onClick={()=>setOpen(true)}
                >
                <Trash className="h-4 w-4"/>    
                </Button>
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        
                        <FormField 
                            name="name"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <Label>Name</Label>
                                    <Input disabled={loading} placeholder="Store name" {...field}/>
                                    <FormMessage />
                                </FormItem>
                        )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert
            title="NEXT_PUBLIC_API_URL" 
            description={`${origin}/api/${params.storeId}`} 
            variant="public"
            />
        </>
    );
}
export default SettingsForms;