"use client"
import { useUserStore } from "@/store/user-store"

const Page = () => {

  const currentUser = useUserStore((state) => state.currentUser);
  console.log(currentUser)

  return (
    <div className="text-black">
      {currentUser && currentUser?.name}
    </div>
  )
}
export default Page