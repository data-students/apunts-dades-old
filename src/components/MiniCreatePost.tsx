"use client"

import { Session } from "next-auth"
import { usePathname, useRouter } from "next/navigation"
import { FC } from "react"
import UserAvatar from "./UserAvatar"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/Button"

interface MiniCreatePostProps {
  session: Session | null
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="overflow-hidden rounded-md bg-white shadow">
      <div className="h-full px-6 py-6 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user?.name || null,
              image: session?.user?.image || null,
            }}
          />
        </div>

        <Link
          href={pathname + "/submit"}
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
        >
          Penja Apunts
        </Link>

        <Link
          href={pathname + "/q"}
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
        >
          Llança una pregunta
        </Link>
      </div>
    </div>
  )
}

export default MiniCreatePost
