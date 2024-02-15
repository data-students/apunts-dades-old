const { PrismaClient } = require("@prisma/client");
const readlineSync = require("readline-sync");

const prisma = new PrismaClient();

async function processUserRequests() {
  // Get generacio from the user
  const generacio = parseInt(readlineSync.question('Enter generacio: '));

  // Fetch non-verified user requests for the specified generacio
  const userRequests = await prisma.userRequest.findMany({
    where: {
      generacio,
      verified: false,
    },
  });

  // Process each user request
  for (const userRequest of userRequests) {
    console.log(`User Request ID: ${userRequest.requestId}`);
    console.log(`UserID: ${userRequest.userid}`);
    console.log(`Email: ${userRequest.email}`);
    console.log(`Generacio: ${userRequest.generacio}`);
    const userName = userRequest.email.split('.').slice(0, 2).map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ');
    console.log(`User: ${userName}`);

    // Check if a user with the same email already exists
    const existingUser = await prisma.authorizedUsers.findUnique({
      where: {
        email: userRequest.email,
      },
    });

    if (existingUser) {
      console.log('User with the same email already exists. Skipping.');
      continue; // Skip to the next iteration
    }

    // Ask user to accept or deny
    const response = readlineSync.question('Accept (A) / Deny (D): ');

    if (response.toLowerCase() === 'a') {
      // Create a new user with the corresponding details
      await prisma.authorizedUsers.create({
        data: {
          email: userRequest.email,
          generacio: userRequest.generacio,
          createdAt: new Date(),
        },
      });

      // Update user request to verified
      await prisma.userRequest.update({
        where: {
          requestId: userRequest.requestId,
        },
        data: {
          verified: true,
        },
      });

      console.log('User accepted and created.');
    } else if (response.toLowerCase() === 'd') {
      // Update user request to denied
      await prisma.userRequest.update({
        where: {
          requestId: userRequest.requestId,
        },
        data: {
          verified: false,
        },
      });

      console.log('User denied.');
    } else {
      console.log('Invalid response. Skipping.');
    }
  }

  // Close Prisma connection
  await prisma.$disconnect();
}

processUserRequests();