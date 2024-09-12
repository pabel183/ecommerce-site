"use client";

import { Product, Image, Category, Color, Size } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Label } from "@/components/ui/label";

import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/ui/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema=z.object({
    name:   z.string().min(1),
    images: z.object({url:z.string()}).array(),
    price:  z.coerce.number().min(1),
    categoryId: z.string(),
    colorId: z.string(),
    sizeId: z.string(),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type formSchemaValue=z.infer<typeof formSchema>;

interface ProductFormsProps{
    initialData: Product & {
        images: Image[] 
    } | null;
    categories: Category[],
    colors: Color[],
    sizes: Size[],
}

const ProductForms:React.FC<ProductFormsProps>=({
    initialData,
    categories,
    colors,
    sizes,
})=>{
    const params=useParams();
    const router=useRouter();
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false);

    const title=initialData?"Edit product":"Create product";
    const description=initialData?"Edit a product":"Add a new product";
    const toastMessage=initialData?"Product updated":"Product created";
    const action=initialData?"Save changes":"Create";

    const form=useForm<formSchemaValue>({
        resolver:zodResolver(formSchema),
        defaultValues: initialData? {
            ...initialData, price: parseFloat(String(initialData?.price))
        } : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            colorId: "",
            sizeId: "",
            isFeatured: false,
            isArchived: false,
        }
    });
    const onSubmit=async(data:formSchemaValue)=>{
        try{
            setLoading(true);
            if(initialData){
                console.log("Patch: initial data existing you can call patch");
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`,data);
            }else{
                console.log("Post: initial data dosen't existing you can call only post");
                await axios.post(`/api/${params.storeId}/products`,data);
            }
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success(toastMessage);
        }catch(error){
            toast.error("Something went wrong.");
        }finally{
            setLoading(false);
        }
    }
    const onDelete=async()=>{
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted.");
        }catch(error){
            toast.error("Something went wrong.")
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
                            name="images"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Images</FormLabel>
                                    <FormControl>
                                    <ImageUpload
                                    onChange={
                                        (url)=>field.onChange(                                          
                                            [...field.value, {url}]
                                        )
                                    }
                                    onRemove={(url)=>field.onChange(field.value.map((image)=>image.url!=url))}
                                    disable={loading}
                                    values={
                                        field.value.map((image)=>{
                                            return(
                                                image.url
                                            )
                                        })
                                    }
                                    />
                                    </FormControl>
                                </FormItem>
                        )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            name="name"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <Label>Name</Label>
                                    <FormControl>
                                    <Input disabled={loading} placeholder="Product name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            name="price"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <Label>Price</Label>
                                    <FormControl>
                                    <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            name="categoryId"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <Label>Category</Label>
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
                                                placeholder="Select a category"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                            <SelectContent>
                                                {categories.map((category)=>(
                                                    <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            name="sizeId"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <Label>Size</Label>
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
                                                placeholder="Select a size"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                            <SelectContent>
                                                {sizes.map((size)=>(
                                                    <SelectItem
                                                    key={size.id}
                                                    value={size.id}
                                                    >
                                                        {size.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            name="colorId"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <Label>Color</Label>
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
                                                placeholder="Select a color"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                            <SelectContent>
                                                {colors.map((color)=>(
                                                    <SelectItem
                                                    key={color.id}
                                                    value={color.id}
                                                    >
                                                        {color.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            name="isFeatured"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Featured
                                            </FormLabel>
                                            <FormDescription>
                                                This product will appear on the home page
                                            </FormDescription>
                                        </div>
                                </FormItem>
                            )}
                        />
                         <FormField 
                            name="isArchived"
                            control={form.control}
                            render={({field})=>(
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Archived
                                            </FormLabel>
                                            <FormDescription>
                                                This product will not appear anywhre in the store.
                                            </FormDescription>
                                        </div>
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
export default ProductForms;