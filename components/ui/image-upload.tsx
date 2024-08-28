"use client";
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ImageUploadProps{
    disable:boolean;
    values: string[];
    onChage: (url:string)=>void;
    onRemove:()=>void;
}
const ImageUpload:React.FC<ImageUploadProps>=({
    disable,
    values,
    onChage,
    onRemove,
})=>{
    const [mount,setMount]=useState(false);
    useEffect(()=>{
        setMount(true);
    },[]);
    const onUpload=(result:any)=>{
        onChage(result.info.secure_url);
    }
    if(!mount){
        return null;
    }
    return(
        <div >
            <div className='mb-4 flex items-center gap-4' >
                {values.map((url)=>(
                <div className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                    <div className='z-10 absolute top-2 right-2'>
                        <Button variant="destructive" onClick={onRemove}>
                            <Trash className='h-4 w-4'/>
                        </Button>
                    </div>
                    <Image 
                    className='object-fit'
                    fill
                    alt='Image'
                    src={url}
                    />
                </div>
                ))
                }
            </div>
            <div>
                <CldUploadWidget onSuccess={(result)=>onUpload(result)} uploadPreset="uupahusy">
                    {({open})=>{
                        const onClick=()=>{
                            open();
                        }   
                        return(
                            <Button disabled={disable} variant="outline"  onClick={onClick}>
                                <ImagePlus className='h-4 w-4 mr-2'/>
                                Upload Image
                            </Button>
                        )
                    }}
                </CldUploadWidget>
            </div>
        </div>
    );
}
export default ImageUpload;