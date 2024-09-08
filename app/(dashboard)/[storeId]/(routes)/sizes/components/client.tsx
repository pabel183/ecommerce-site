"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/Api-List";

interface SizesClientProps{
    data:SizeColumn[];
}

const SizesClient:React.FC<SizesClientProps>=({
    data
})=>{
    const router=useRouter();
    const params=useParams();

    return(
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Sizes (${data.length})`}
                    description="Manage sizes for your store"
                />
                <Button onClick={()=>router.push(`/${params.storeId}/sizes/new`)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" data={data} columns={columns}/>
            <Heading 
                title="API"
                description="API calls for Sizes"
            />
            <Separator />
            <ApiList entityName="sizes"  entityIdName="sizeId"/>
        </>
    );
}
export default SizesClient;