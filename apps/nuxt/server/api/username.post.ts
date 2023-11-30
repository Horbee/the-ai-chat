import { getServerSession } from "#auth";
import { prisma } from "@/db";

export default defineEventHandler(async (event) => {
  // Auth required
  const session = await getServerSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Login is required",
    });
  }

  // Username field is required
  const body = (await readBody(event)) as { username?: string };

  if (!body.username) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username is required field",
    });
  }

  try {
    await prisma.user.update({
      data: { name: body.username },
      where: { id: session.user.id },
    });
    console.log("Username successfully updated");
  } catch (error) {
    console.error("Username update failed.", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error while updating username",
    });
  }

  return { success: true };
});
