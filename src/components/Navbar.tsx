import Link from "next/link";
import { Icons } from "@/components/Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
	const session = await getAuthSession();

	return (
		<div className="fixed top-0 inset-x-0 h-auto bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
			<div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
				<Link
					href="/"
					className="flex gap-2 items-center">
					<Icons.logo className="w-10 h-10 sm:h-6 sm:w-6" />
					<p className="hidden text-zinc-700 text-sm font-medium md:block">Apunts Dades</p>
				</Link>

				{/* search bar */}

				{session && session.user ? (
						<UserAccountNav user={session.user} />
				) : (
					<div>
						<Link href="/sign-in" className={buttonVariants()}>
							Sign In
						</Link>
						<Link href="/accountrequest" className={`${buttonVariants()} ml-2`}>
							Account Request
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
