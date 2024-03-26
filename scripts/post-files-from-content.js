const { PrismaClient } = require("@prisma/client")
const { default: axios } = require("axios")

const prisma = new PrismaClient()

async function updateRecords() {
  try {
    const recordsToUpdate = await prisma.Post.findMany()

    for (const record of recordsToUpdate) {
      const response = await axios.get(record.content, {
        responseType: "blob",
      })
      const fileObject = new File([response.data], "PDF Sense Nom")

      await prisma.Post.update({
        where: { id: record.id },
        data: {
          files: JSON.stringify([
            {
              name: fileObject.name,
              size: fileObject.size,
              type: fileObject.type,
              url: record.content,
            },
          ]),
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
