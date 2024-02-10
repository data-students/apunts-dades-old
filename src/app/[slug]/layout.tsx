import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { Button, buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

const Layout = async ({ children, params: { slug } }: { children: React.ReactNode; params: { slug: string } }) => {
	const session = await getAuthSession();

	const subject = await db.subject.findFirst({
		where: { acronym: slug },
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});

	const subscription = !session?.user
		? undefined
		: await db.subscription.findFirst({
				where: {
					subject: {
						acronym: slug,
					},
					user: {
						id: session.user.id,
					},
				},
		  });

	const isSubscribed = !!subscription;

	if (!subject) return notFound();

	const memberCount = await db.subscription.count({
		where: {
			subject: {
				acronym: slug,
			},
		},
	});

	const startsWithVowel = /^[aeiouàáâãäåæçèéêëìíîïðòóôõöøùúûüýÿ]/i;
	const subjectNameArticle = subject.name.match(startsWithVowel) ? "d'" : "de ";

	return (
		<div className="sm:container max-w-7xl mx-auto h-full pt-12">
			<div>
				{/* TODO: Button to take us back */}
				<Button />

				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
					<div className="flex flex-col col-span-2 space-y-6">{children}</div>

					{/* info sidebar */}
					<div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
						<div className="px-6 py-4">
							<p className="font-semibold py-3">
								Apunts {subjectNameArticle}
								{subject.name}
							</p>
						</div>

						<dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
							<div className="flex justify-between gap-x-4 py-3">
								<dt className="text-gray-500">Membres</dt>
								<dd className="text-gray-700">{memberCount}</dd>
							</div>
							<div className="flex justify-between gap-x-4 py-3">
								<dt className="text-gray-500">Subscripció</dt>
								<dd className="text-gray-700">{isSubscribed ? "Subscrit" : "No subscrit"}</dd>
							</div>
							<div className="flex justify-between gap-x-4 py-3">
								<dt className="text-gray-500">Quadrimestre</dt>
								<dd className="text-gray-700">
									{
										subject.semester ? subject.semester?.name : "GCED" // TODO: Cal fer els trimestres obligatoris (això inclou el form de creació de subjectes)
									}
								</dd>
							</div>
							<div className="flex justify-between gap-x-4 py-3">
								<dt className="text-gray-500">Subscripció</dt>
								<dd className="text-gray-700">{isSubscribed ? "Subscrit" : "No subscrit"}</dd>
							</div>
							{subject.creatorId === session?.user?.id ? ( // TODO: Check if user is admin
								<div className="flex justify-between gap-x-4 py-3">
									<p className="text-gray-500">Pots editar aquesta assignatura</p>
								</div>
							) : null}

							{subject.creatorId !== session?.user?.id ? ( // TODO: Hem de fer que els admins estiguin subscrits a tots els subjectes
								<SubscribeLeaveToggle
									subjectId={subject.id}
									subjectName={subject.name}
									isSubscribed={isSubscribed}
								/>
							) : null}

							<Link
								href={`r/${slug}/submit`}
								className={buttonVariants({ variant: "outline", className: "w-full mb-6" })}>
								Comparteix Apunts
							</Link>
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Layout;
