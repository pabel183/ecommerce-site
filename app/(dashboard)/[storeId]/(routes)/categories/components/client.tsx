"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/Api-List";

interface CategoryClientProps{
    data:CategoryColumn[];
}

const CategoryClient:React.FC<CategoryClientProps>=({
    data
})=>{
    const router=useRouter();
    const params=useParams();

    return(
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Categories (${data.length})`}
                    description="Manage categories for your store"
                />
                <Button onClick={()=>router.push(`/${params.storeId}/categories/new`)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" data={data} columns={columns}/>
            <Heading 
                title="API"
                description="API calls for Categories"
            />
            <Separator />
            <ApiList entityName="categories"  entityIdName="categoryId"/>
        </>
    );
}
export default CategoryClient;