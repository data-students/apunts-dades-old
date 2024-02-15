import CustomFeed from "@/components/CustomFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

import { db } from "@/lib/db";
import { BookIcon } from "lucide-react";
import { HeartIcon, HeartPulseIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default async function Home() {
	const session = await getAuthSession();

	const subjects = await db.subject.findMany({
		select: {
			id: true,
			acronym: true,
			name: true,
			semester: true,
		},
	});

	// const subscription = !session?.user
	// 	? undefined
	// 	: await db.subscription.findFirst({
	// 			where: {
	// 				userId: session.user.id,
	// 				subjectId: subjects.id,
	// 			},
	// 	  });

	// const isSubscribed = !!subscription;
	// const ColorClass = isSubscribed ? "text-red-500" : "text-black";

	function semesterColor(semester: string) {
		switch (semester) {
			case "Q1":
				return "bg-emerald-100";
			case "Q2":
				return "bg-rose-100";
			case "Q3":
				return "bg-cyan-100";
			case "Q4":
				return "bg-amber-100";
			case "Q5":
				return "bg-violet-100";
			case "Q6":
				return "bg-blue-100";
			default:
				return "bg-gray-100";
		}
	}

	return (
		<>
			<h1 className="font-bold text-3xl md:text-4xl">El teu espai</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
				{/* Feed
				{session ? <CustomFeed /> : null} */}

				{/* subjects info */}
				{/* <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last mb-4">
					<div className="bg-emerald-100 px-6 py-4">
						<p className="font-semibold py-3 flex items-center gap-1.5">
							<HomeIcon className="w-4 h-4" />
							Home
						</p>
					</div>

					<div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
						<div className="flex justify-between gap-x-4 py-3">
							<p className="text-zinc-500">
								La teva pàgina d'Apunts de Dades. Accedeix aquí per a veure els apunts de les assignatures que
								t'interessen.
							</p>
						</div>

						<Link
							className={buttonVariants({
								className: "w-full mt-4 mb-6",
							})}
							href="/create">
							Crea una assignatura
						</Link>
					</div>
				</div> */}
				{subjects.map((subject, index) => {
					return (
						<Link
							key={index}
							className="w-full mt-4 mb-6"
							href={`/${subject.acronym}`}>
							<div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
								<div className={cn("px-6 py-2", semesterColor(subject.semester))}>
									<p className="font-semibold py-1 flex items-center gap-1.5">
										<BookIcon className="w-4 h-4" />
										{subject.name}
										{/* <HeartIcon className={cn("h-5 w-5", ColorClass)} /> */}
									</p>
								</div>

								<div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 space-x-2">
									<Badge variant="outline">{subject.semester}</Badge>
									<Badge variant="outline">{subject.acronym}</Badge>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</>
	);
}
