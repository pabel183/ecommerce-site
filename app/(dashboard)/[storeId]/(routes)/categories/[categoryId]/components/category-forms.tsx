"use client";

import { Billboard, Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Label } from "@/components/ui/label";

import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/ui/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const formSchema=z.object({
    name:z.string().min(1),
    billboardId:z.string().min(1),
})
type formSchemaValue=z.infer<typeof formSchema>;

interface CategoryFormProps{
    initialData: Category | null;
    billboards: Billboard[];
}

const CategoryForm:React.FC<CategoryFormProps>=({
    initialData,
    billboards
})=>{
    const params=useParams();
    const router=useRouter();
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false);

    const title=initialData?"Edit category":"Create category";
    const description=initialData?"Edit a category":"Add a new category";
    const toastMessage=initialData?"Category updated":"Category created";
    const action=initialData?"Save changes":"Create";

    const form=useForm<formSchemaValue>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name: "",
            billboardId:""
        }
    });
    const onSubmit=async(data:formSchemaValue)=>{
        try{
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,data);
            }else{
                await axios.post(`/api/${params.storeId}/categories`,data);
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`);
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success("Category deleted.");
        }catch(error){
            toast.error("Make sure you remove all products using this category first.")
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
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            name="name"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <Label>Name</Label>
                                    <FormControl>
                                    <Input disabled={loading} placeholder="Category name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            name="billboardId"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <Label>Billboard</Label>
                                    <Select
                                    disabled={loading}
                                    defaultValue={field.value}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                defaultValue={field.value}
                                                placeholder="Select a billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                            <SelectContent>
                                                {billboards.map((billboard)=>(
                                                    <SelectItem
                                                    key={billboard.id}
                                                    value={billboard.id}
                                                    >
                                                        {billboard.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
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
export default CategoryForm;