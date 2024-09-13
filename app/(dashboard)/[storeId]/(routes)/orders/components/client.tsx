"use client";
import { Separator } from "@/components/ui/separator";
import { OrderColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

import { Heading } from "@/components/ui/heading";

interface OrderClientProps{
    data:OrderColumn[];
}

const OrderClient:React.FC<OrderClientProps>=({
    data
})=>{

    return(
        <>
                <Heading 
                    title={`Orders (${data.length})`}
                    description="Manage orders for your store"
                />
            <Separator />
            <DataTable searchKey="products" data={data} columns={columns}/>  
        </>
    );
}
export default OrderClient;