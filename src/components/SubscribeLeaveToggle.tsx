"use client";

import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { SubscribeToSubjectPayload } from "@/lib/validators/subject";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

interface SubscribeLeaveToggleProps {
	subjectId: string;
	subjectName: string;
	isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ subjectId, subjectName, isSubscribed }) => {
	const { loginToast } = useCustomToasts();
	const router = useRouter();

	const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubjectPayload = {
				subjectId,
			};
			const { data } = await axios.post("/api/subject/subscribe", payload);
			return data as string;
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: "S'ha produït un error desconegut.",
				description: "No s'ha pogut subscriure a l'assignatura. Siusplau, torna a intentar-ho més tard.",
				variant: "destructive",
			});
		},
		onSuccess: (data) => {
			startTransition(() => {
				router.refresh();
			});

			const startsWithVowel = /^[aeiouàáâãäåæçèéêëìíîïðòóôõöøùúûüýÿ]/i;
			const subjectArticle = subjectName.match(startsWithVowel) ? "d'" : "de ";

			return toast({
				title: `T'has subscrit als apunts ${subjectArticle}${subjectName}!`,
				description: "Ara rebràs notificacions quan es publiquin apunts.", // TODO: Això és mentida per ara
			});
		},
	});

	const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubjectPayload = {
				subjectId,
			};
			const { data } = await axios.post("/api/subject/unsubscribe", payload);
			return data as string;
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: "S'ha produït un error desconegut.",
				description:
					"No s'ha pogut donar de baixa la subscripció a l'assignatura. Siusplau, torna a intentar-ho més tard.",
				variant: "destructive",
			});
		},
		onSuccess: (data) => {
			startTransition(() => {
				router.refresh();
			});

			const startsWithVowel = /^[aeiouàáâãäåæçèéêëìíîïðòóôõöøùúûüýÿ]/i;
			const subjectArticle = subjectName.match(startsWithVowel) ? "d'" : "de ";

			return toast({
				title: `Has donat de baixa la teva subscripció als apunts ${subjectArticle}${subjectName}!`,
				description: "Deixaràs de rebre notificacions quan es publiquin apunts.", // TODO: Això és mentida per ara
			});
		},
	});

	return isSubscribed ? (
		<Button
			isLoading={isUnsubLoading}
			onClick={() => unsubscribe()}
			className="w-full mt-1 mb-4">
			Deixar de seguir
		</Button>
	) : (
		<Button
			isLoading={isSubLoading}
			onClick={() => subscribe()}
			className="w-full mt-1 mb-4">
			Seguir
		</Button>
	);
};

export default SubscribeLeaveToggle;
