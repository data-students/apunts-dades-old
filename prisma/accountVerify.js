const { PrismaClient } = require("@prisma/client");
const Papa = require("papaparse");
const fs = require("fs");

const prisma = new PrismaClient();

async function processUserRequests() {
  const userbasePath = "userbase.csv";
  const userBaseFileData = fs.readFileSync(userbasePath, "utf8");
  const verifiedValid = ["sí", "si"];
  const parsedUserBase = Papa.parse(userBaseFileData, {
    header: true, // Assuming the first row contains the headers
    dynamicTyping: true, // Automatically convert strings to their appropriate data type
    skipEmptyLines: true, // Skip empty lines in the CSV
    complete: function async(result) {
      result.data.forEach(async (row) => {
        const email = row.email;
        const generacio = row.generacio;
        const verificat = row.verificat;

        if (verificat && verifiedValid.includes(verificat.toLowerCase())) {
          const existingUser = await prisma.authorizedUsers.findUnique({
            where: {
              email: email,
            },
          });
          if (!existingUser) {
            await prisma.authorizedUsers.create({
              data: {
                email: email,
                generacio: generacio,
                createdAt: new Date(),
              },
            });
          }
        }
      });
    },
  });
  await prisma.$disconnect();
}

processUserRequests();