"use client";

import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react";

const ModalProvider=()=>{
    const [isMount, setIsMount]=useState(false);
    useEffect(()=>{
       setIsMount(true); 
    },[]);
    if(!isMount){
        return null;
    }
    return(
        <>
            <StoreModal />
        </>
    )
}
export default ModalProvider;