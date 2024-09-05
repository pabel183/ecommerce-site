"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/Api-List";

interface BillboardClientProps{
    data:BillboardColumn[];
}

const BillboardClient:React.FC<BillboardClientProps>=({
    data
})=>{
    const router=useRouter();
    const params=useParams();

    return(
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Billboards (${data.length})`}
                    description="Manage billboards for your store"
                />
                <Button onClick={()=>router.push(`/${params.storeId}/billboards/new`)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="label" data={data} columns={columns}/>
            <Heading 
                title="API"
                description="API calls for Billboards"
            />
            <Separator />
            <ApiList entityName="billboards"  entityIdName="billboardId"/>
        </>
    );
}
export default BillboardClient;