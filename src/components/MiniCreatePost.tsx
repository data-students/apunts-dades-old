"use client"

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

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
					{/* <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" /> */}

				</div>
                
                <Link
                    href={pathname + "/submit"}
                    className={buttonVariants({
                        variant: "outline",
                        className: "w-full",
                    })}>
                    Penja Apunts
                </Link>

                <Link
                    href={pathname + "/q"}
                    className={buttonVariants({
                        variant: "outline",
                        className: "w-full",
                    })}>
                    Llança una pregunta
                </Link>

        {/* <Button
					onClick={() => router.push(parentPathname + "/submit")}
					variant="ghost">
					<ImageIcon className="text-zinc-600" />
				</Button>

				<Button
					onClick={() => router.push(parentPathname + "/submit")}
					variant="ghost">
					<FileIcon className="text-zinc-600" />
				</Button>

				<Button
					onClick={() => router.push(parentPathname + "/submit")}
					variant="ghost">
					<Link2 className="text-zinc-600" />
				</Button> */}
      </div>
    </div>
  )
}

export default MiniCreatePost
