import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
	const loginToast = () => {
		const { dismiss } = toast({
			title: "Inici de sessió necessari.",
			description: "Necessites iniciar sessió per a accedir a aquesta pàgina.",
			variant: "destructive",
			action: (
				<Link
					href="/sign-in"
					onClick={() => dismiss()}
					className={buttonVariants({ variant: "outline" })}>
					Inicia sessió
				</Link>
			),
		});
	};

	return { loginToast };
};
