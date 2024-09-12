"use client";
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ImageUploadProps{
    disable:boolean;
    onChange: (value:string)=>void;
    onRemove:(value:string)=>void;
    values: string[];
}
const ImageUpload:React.FC<ImageUploadProps>=({
    disable,
    values,
    onChange,
    onRemove,
})=>{
    const [mount,setMount]=useState(false);
    useEffect(()=>{
        setMount(true);
    },[]);
    const onUpload=(result:any)=>{
        onChange(result.info.secure_url);
    }
    if(!mount){
        return null;
    }
    const onDelete=(url:string)=>{
        onRemove(url)
    }
    return(
        <div >
            <div className='mb-4 flex items-center gap-4' >
                   { values.map((url)=>(
                        <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                            <div className='z-10 absolute top-2 right-2'>
                                <Button variant="destructive" onClick={()=>onDelete(url)}>
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
                    ))}            
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