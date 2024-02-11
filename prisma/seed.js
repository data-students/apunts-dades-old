const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const aed = await prisma.user.upsert({
		where: { email: "info@aed.cat" },
		update: {},
		create: {
			email: "info@aed.cat",
			name: "Associació d'Estudiants de Dades",
			username: "AED",
			generacio: 2017,
		},
	});
	const createManySubjects = await prisma.subject.createMany({
		data: [
			{ name: "ALG", acronym: "ALG", semester: "Q1", creatorId: aed.id },
			{ name: "CAL", acronym: "CAL", semester: "Q1", creatorId: aed.id },
			{ name: "LMD", acronym: "LMD", semester: "Q1", creatorId: aed.id },
			{ name: "AP1", acronym: "AP1", semester: "Q1", creatorId: aed.id },
			{ name: "AP2", acronym: "AP2", semester: "Q2", creatorId: aed.id },
			{ name: "AC2", acronym: "AC2", semester: "Q2", creatorId: aed.id },
			{ name: "PIE1", acronym: "PIE1", semester: "Q2", creatorId: aed.id },
			{ name: "COM", acronym: "COM", semester: "Q2", creatorId: aed.id },
			{ name: "SIS", acronym: "SIS", semester: "Q3", creatorId: aed.id },
			{ name: "AP3", acronym: "AP3", semester: "Q3", creatorId: aed.id },
			{ name: "TEOI", acronym: "TEOI", semester: "Q3", creatorId: aed.id },
			{ name: "PIE2", acronym: "PIE2", semester: "Q3", creatorId: aed.id },
			{ name: "BD", acronym: "BD", semester: "Q3", creatorId: aed.id },
			{ name: "PSD", acronym: "PSD", semester: "Q4", creatorId: aed.id },
			{ name: "IPA", acronym: "IPA", semester: "Q4", creatorId: aed.id },
			{ name: "OM", acronym: "OM", semester: "Q4", creatorId: aed.id },
			{ name: "AD", acronym: "AD", semester: "Q4", creatorId: aed.id },
			{ name: "AA1", acronym: "AA1", semester: "Q4", creatorId: aed.id },
			{ name: "VI", acronym: "VI", semester: "Q5", creatorId: aed.id },
			{ name: "CAI", acronym: "CAI", semester: "Q5", creatorId: aed.id },
			{ name: "BDA", acronym: "BDA", semester: "Q5", creatorId: aed.id },
			{ name: "AA2", acronym: "AA2", semester: "Q5", creatorId: aed.id },
			{ name: "EI", acronym: "EI", semester: "Q5", creatorId: aed.id },
			{ name: "TAED1", acronym: "TAED1", semester: "Q6", creatorId: aed.id },
			{ name: "POE", acronym: "POE", semester: "Q6", creatorId: aed.id },
			{ name: "PIVA", acronym: "PIVA", semester: "Q6", creatorId: aed.id },
			{ name: "PE", acronym: "PE", semester: "Q6", creatorId: aed.id },
			{ name: "TAED2", acronym: "TAED2", semester: "Q7", creatorId: aed.id },
			{ name: "Altres", acronym: "Altres", semester: "Q8", creatorId: aed.id },
		],
		skipDuplicates: true,
	});
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  