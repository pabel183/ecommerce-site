import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStoresByUserId } from "@/lib/data/store";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/sign-in');
    }

    const store = await getStoresByUserId(session.user.id);

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={store} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    <span className="text-sm font-medium">{session.user.name || session.user.email}</span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;