import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";

const Navbar=async()=>{
    const {userId}=auth();
    if(!userId){
        redirect(`/sign-in`);
    }

    const store=await prismadb.store.findMany({
        where:{
            userId,
        }
    });

    return(
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={store}/>
                <MainNav className="ml-4"/>
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton />
                </div>
            </div>
        </div>
    );
}
export default Navbar;