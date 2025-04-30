// // pages/api/card/delete.ts

// import { getServerSession } from "next-auth"
// import { authOptions } from "../auth/[...nextauth]"
// import { prisma } from "@/lib/prisma"
// import type { NextApiRequest, NextApiResponse } from "next"

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "DELETE") {
//     return res.status(405).json({ message: "Method Not Allowed" })
//   }

//   const session = await getServerSession(req, res, authOptions)

//   if (!session || !session.user?.email) {
//     return res.status(401).json({ message: "Unauthorized" })
//   }

//   const { cardId } = req.body

//   try {
//     const card = await prisma.card.findUnique({
//       where: { id: cardId },
//       include: { user: true },
//     })

//     if (!card || card.user.email !== session.user.email) {
//       return res.status(403).json({ message: "Forbidden or Card Not Found" })
//     }

//     await prisma.card.delete({
//       where: { id: cardId },
//     })

//     return res.status(200).json({ message: "Card deleted" })
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error" })
//   }
// }
