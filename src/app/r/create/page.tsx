"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateSubjectPayload } from "@/lib/validators/subject";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

const Page = () => {
	const [name, setName] = useState<string>("");
	const [acronym, setAcronym] = useState<string>("");
	const router = useRouter();
	const { loginToast } = useCustomToast();

	const { mutate: createSubject, isLoading } = useMutation({
		mutationFn: async () => {
			const payload: CreateSubjectPayload = {
				name: name,
				acronym: acronym,
			};

			const { data } = await axios.post("/api/subject", payload);
			return data as string;
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 409) {
					return toast({
						title: "L'assignatura ja existeix.",
						description: "Siusplau, tria un altre nom o acrònim.",
						variant: "destructive",
					});
				}

				if (err.response?.status === 422) {
					return toast({
						title: "Nom d'assignatura o acrònim invàlid.",
						description: "Siusplau, tria un altre nom de menys de 255 caràcters i un acrònim d'entre 2 i 5 caràcters.",
						variant: "destructive",
					});
				}

				if (err.response?.status === 401) {
					return loginToast();
				}
			}

			toast({
				title: "S'ha produït un error desconegut.",
				description: "No s'ha pogut crear l'assignatura. Siusplau, torna a intentar-ho més tard.",
				variant: "destructive",
			});
		},
		onSuccess: (data) => {
			router.push(`/r/${data}`);
		},
	});

	return (
		<div className="container flex items-center h-full max-w-3xl mx-auto">
			<div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-semibold">Crea una assignatura</h1>
				</div>

				<hr className="bg-zinc-500 h-px" />

				<div>
					<p className="text-lg font-medium">Nom</p>
					<p className="text-xs pb-2">El nom d'una assignatura no podrà ser modificat.</p>
					<div className="relative my-2">
						<p className="absolute text-sm left-2 w-8 inset-y-0 grid place-items-center text-zinc-400">Codi/</p>
						<Input
							value={acronym}
							onChange={(e) => setAcronym(e.target.value)}
							className="pl-12"
						/>
					</div>
					<div className="relative my-2">
						<p className="absolute text-sm left-2 w-8 inset-y-0 grid place-items-center text-zinc-400">Nom/</p>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="pl-12"
						/>
					</div>
				</div>

				<div className="flex justify-end gap-4">
					<Button
						variant="subtle"
						onClick={() => router.back()}>
						Cancel·la
					</Button>
					<Button
						isLoading={isLoading}
						disabled={acronym.length === 0 || name.length === 0}
						onClick={() => createSubject()}>
						Crea
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Page;
