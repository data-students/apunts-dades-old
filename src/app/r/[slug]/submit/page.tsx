import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
	params: {
		slug: string;
	};
}

const page = async ({ params }: PageProps) => {
	const subject = await db.subject.findFirst({
		where: { acronym: params.slug },
	});

	if (!subject) return notFound();

	const startsWithVowel = /^[aeiouàáâãäåæçèéêëìíîïðòóôõöøùúûüýÿ]/i;
	const subjectArticle = subject.name.match(startsWithVowel) ? "d'" : "de ";

	return (
		<div className="flex flex-col items-start gap-6">
			<div className="border-b border-gray-200 pb-5">
				<div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
					<h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">Comparteix Apunts</h3>
					<p className="ml-2 mt-1 truncate text-sm text-gray-500">
						{subjectArticle}
						{subject.name}
					</p>
				</div>
			</div>

			{/* form */}
			<Editor subjectId={subject.id} />

			<div className="w-full flex justify-end">
				<Button
					type="submit"
					className="w-full"
					form="subject-post-form">
					Compartir
				</Button>
			</div>
		</div>
	);
};

export default page;
