"use client";

import { Button } from "./ui/Button";
import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { toast } = useToast();

	const loginWithGoogle = async () => {
		setIsLoading(true);

		try {
			await signIn("google", { callbackUrl: "/" });
		} catch (error) {
			toast({
				title: "Hi ha hagut un problema.",
				description: "Hi ha hagut un error al iniciar sessió amb Google. Si us plau, torna a intentar-ho.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex justify-center", className)}>
			<Button
				onClick={loginWithGoogle}
				isLoading={isLoading}
				size="sm"
				className="w-full">
				{isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
				Google
			</Button>
		</div>
	);
};

export default UserAuthForm;
