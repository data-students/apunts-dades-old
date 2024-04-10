"use client"

import { Session } from "next-auth"
import { usePathname } from "next/navigation"
import { FC } from "react"
import UserAvatar from "./UserAvatar"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/Button"

interface CreatePostProps {
  session: Session | null
}

const CreatePost: FC<CreatePostProps> = ({ session }) => {
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
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
    </div>
  )
}

export default CreatePost
