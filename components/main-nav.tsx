"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const MainNav=({
    className,
    ...props
}:React.HtmlHTMLAttributes<HTMLElement>)=>{
    const params=useParams();
    const pathname=usePathname();

    const routes=[
        {
        href:`/${params.storeId}`,
        lebel:"Overview",
        active:pathname===`/${params.storeId}`
        },
        {
        href:`/${params.storeId}/billboards`,
        lebel:"Billboard",
        active:pathname===`/${params.storeId}/billboards`
        },
        {
        href:`/${params.storeId}/categories`,
        lebel:"Categories",
        active:pathname===`/${params.storeId}/categories`
        },
        {
        href:`/${params.storeId}/settings`,
        lebel:"Settings",
        active:pathname===`/${params.storeId}/settings`
        }
        ];
    return(
        <nav className={cn(`flex items-center space-x-4 lg:space-x-6`,className)}>
            {routes.map((route)=>(
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(`text-sm font-medium transition-colors hover:text-primary`,
                        route.active?"text-black dark:text-white":"text-muted-foreground"
                    )}
                >
                    {route.lebel}
                </Link>
            ))}
        </nav>
    );
}