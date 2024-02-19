import { Icons } from "@/components/Icons";
import Link from "next/link";
import UserAuthForm from "@/components/UserAuthForm";

const SignIn = () => {
	return (
		<div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w[400px]">
			<div className="flex flex-col space-y-2 text-center">
				<Icons.logo className="mx-auto h-6 w-6" />
				<h1 className="text-2xl font-semibold tracking-tight">Bentornat!</h1>
				<p className="text-sm max-w-xs mx-auto">
					Continuant, entraràs al teu un compte d&apos;Apunts Dades sota les nostres Condicions d&apos;Ús i Polítiques de
					Privacitat.
				</p>

				{/* sign in form */}
				<UserAuthForm />

				<p className="px-8 text-center text-sm text-zinc-700">
					No tens un compte?{" "}
					<Link
						href="https://forms.gle/xBfXgAdVTWvBFRGb8"
						className="hover:text-zinc-800 text-sm underline underline-offset-4"
						target="_blank"
						rel="noopener noreferrer"
					>
						Registra&apos;t
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignIn;
