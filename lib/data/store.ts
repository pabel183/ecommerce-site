import prismadb from "@/lib/prismadb";


//multiple stores
export async function getStoresByUserId(userId: string) {
  try {
    const stores = await prismadb.store.findMany({
      where: { userId },
    });
    return stores;
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    return [];
  }
}


//first stores
export async function getFirstStoreByUserId(userId: string) {
  try {
    return await prismadb.store.findFirst({
      where: { userId },
    });
  } catch (error) {
    console.error("Failed to fetch first store:", error);
    return null;
  }
}