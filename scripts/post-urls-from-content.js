const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function updateRecords() {
  try {
    const recordsToUpdate = await prisma.Post.findMany()

    for (const record of recordsToUpdate) {
      await prisma.Post.update({
        where: { id: record.id },
        data: {
          urls: JSON.stringify([record.content]),
        },
      })
    }

    console.log("Records updated successfully.")
  } catch (error) {
    console.error("Error updating records:", error)
  } finally {
    await prisma.$disconnect()
  }
}

updateRecords()
