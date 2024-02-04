import Link from "next/link";
import { Icons } from "@/components/Icons";
import Image from "next/image";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";

const Navbar = async () => {
	const session = await getAuthSession();

	return (
		<div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
			<div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
				<Link
					href="/"
					className="flex gap-2 items-center">
					<Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" />
					{/* <Image // TODO: Hauria de ser un SVG tal i com està implementat Icons.logo
						src="/aed.png"
						width={1000}
						height={760}
						className="h-8 w-8 sm:h-6 sm:w-6"
						alt="AED Logo"
					/> */}
					<p className="hidden text-zinc-700 text-sm font-medium md:block">Apunts Dades</p>
				</Link>

				{/* search bar */}

				{session ? (
					<p>You are logged in</p>
				) : (
					<Link
						href="/sign-in"
						className={buttonVariants()}>
						Sign In
					</Link>
				)}
			</div>
		</div>
	);
};

export default Navbar;
