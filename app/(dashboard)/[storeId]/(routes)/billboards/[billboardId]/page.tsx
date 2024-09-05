import prismadb from "@/lib/prismadb";
import BillboardForms from "./components/billboard-forms";

const BillboardPage=async({
    params
}:{
    params:{billboardId:string}
})=>{
    const billboard=await prismadb.billboard.findUnique({
        where:{
            id:params.billboardId,
        }
    })
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-6 p-8 pt-6">
                <BillboardForms initialData={billboard} />
            </div>
        </div>
    );
}
export default BillboardPage;