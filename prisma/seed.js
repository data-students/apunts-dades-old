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
			{ name: "Àlgebra", acronym: "ALG", semester: "Q1", creatorId: aed.id },
			{ name: "Algorísmia i Programació I", acronym: "AP1", semester: "Q1", creatorId: aed.id },
			{ name: "Càlcul", acronym: "CAL", semester: "Q1", creatorId: aed.id },
			{ name: "Lògica i Matemàtica Discreta", acronym: "LMD", semester: "Q1", creatorId: aed.id },
			{ name: "Àlgebra i Càlcul Avançats", acronym: "AC2", semester: "Q2", creatorId: aed.id },
			{ name: "Algorísmia i Programació II", acronym: "AP2", semester: "Q2", creatorId: aed.id },
			{ name: "Computadors", acronym: "COM", semester: "Q2", creatorId: aed.id },
			{ name: "Probabilitat i Estadística I", acronym: "PIE1", semester: "Q2", creatorId: aed.id },
			{ name: "Algorísmia i Programació III", acronym: "AP3", semester: "Q3", creatorId: aed.id },
			{ name: "Bases de Dades", acronym: "BD", semester: "Q3", creatorId: aed.id },
			{ name: "Probabilitat i Estadística II", acronym: "PIE2", semester: "Q3", creatorId: aed.id },
			{ name: "Senyals i Sistemes", acronym: "SIS", semester: "Q3", creatorId: aed.id },
			{ name: "Teoria de la Informació", acronym: "TEOI", semester: "Q3", creatorId: aed.id },
			{ name: "Aprenentatge Automàtic I", acronym: "AA1", semester: "Q4", creatorId: aed.id },
			{ name: "Anàlisi de Dades", acronym: "AD", semester: "Q4", creatorId: aed.id },
			{ name: "Introducció al Processament Audiovisual", acronym: "IPA", semester: "Q4", creatorId: aed.id },
			{ name: "Optimització Matemàtica", acronym: "OM", semester: "Q4", creatorId: aed.id },
			{ name: "Paral·lelisme i Sistemes Distribuïts", acronym: "PSD", semester: "Q4", creatorId: aed.id },
			{ name: "Aprenentatge Automàtic II", acronym: "AA2", semester: "Q5", creatorId: aed.id },
			{ name: "Bases de Dades Avançades", acronym: "BDA", semester: "Q5", creatorId: aed.id },
			{ name: "Cerca i Anàlisi de la Informació", acronym: "CAI", semester: "Q5", creatorId: aed.id },
			{ name: "Emprenedoria i Innovació", acronym: "EI", semester: "Q5", creatorId: aed.id },
			{ name: "Visualització de la Informació", acronym: "VI", semester: "Q5", creatorId: aed.id },
			{ name: "Projectes d'Enginyeria", acronym: "PE", semester: "Q6", creatorId: aed.id },
			{ name: "Processament d'Imatge i Visió Artificial", acronym: "PIVA", semester: "Q6", creatorId: aed.id },
			{ name: "Processament del Llenguatge Oral i Escrit", acronym: "POE", semester: "Q6", creatorId: aed.id },
			{ name: "Temes Avançats d'Enginyeria de Dades I", acronym: "TAED1", semester: "Q6", creatorId: aed.id },
			{ name: "Temes Avançats d'Enginyeria de Dades II", acronym: "TAED2", semester: "Q7", creatorId: aed.id },
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
  