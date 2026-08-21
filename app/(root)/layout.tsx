import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFirstStoreByUserId } from "@/lib/data/store";

export default async function SetupPageLayout({
    children
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/sign-in");
    }

    const store = await getFirstStoreByUserId(session.user.id);

    if (store) {
        redirect(`/${store.id}`);
    }

    return (
        <>
            {children}
        </>
    );
}

