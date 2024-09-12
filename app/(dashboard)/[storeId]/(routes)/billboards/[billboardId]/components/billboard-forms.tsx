"use client";

import { Billboard } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Label } from "@/components/ui/label";

import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/ui/alert-modal";
import ImageUpload from "@/components/ui/image-upload";


const formSchema=z.object({
    label:z.string().min(1),
    imageUrl:z.string().min(1),
})
type formSchemaValue=z.infer<typeof formSchema>;

interface BillboardFormsProps{
    initialData: Billboard | null;
}

const BillboardForms:React.FC<BillboardFormsProps>=({
    initialData
})=>{
    const params=useParams();
    const router=useRouter();
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false);

    const title=initialData?"Edit billboard":"Create billboard";
    const description=initialData?"Edit a billboard":"Add a new billboard";
    const toastMessage=initialData?"Billboard updated":"Billboard created";
    const action=initialData?"Save changes":"Create";

    const form=useForm<formSchemaValue>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            label: "",
            imageUrl:""
        }
    });
    const onSubmit=async(data:formSchemaValue)=>{
        try{
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data);
            }else{
                await axios.post(`/api/${params.storeId}/billboards`,data);
            }
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success(toastMessage);
        }catch(error){
            toast.error("Something went wrong");
        }finally{
            setLoading(false);
        }
    }
    const onDelete=async()=>{
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success("Billboard deleted.");
        }catch(error){
            toast.error("Make sure you remove all catagories using this billboard first.")
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
                    title={title}
                    description={description}
                    />
                {initialData && (
                    <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={()=>setOpen(true)}
                    >
                        <Trash className="h-4 w-4"/>    
                    </Button>
                )}
            </div>
            <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <FormField 
                            name="imageUrl"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <ImageUpload
                                    values={field.value?[field.value]:[]}
                                    onChange={(url)=>(field.onChange(url))}
                                    onRemove={()=>field.onChange("")}
                                    disable={loading}
                                    />
                                </FormItem>
                        )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            name="label"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <Label>Label</Label>
                                    <FormControl>
                                    <Input disabled={loading} placeholder="Billboard label" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    );
}
export default BillboardForms;