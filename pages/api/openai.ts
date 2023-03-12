import type { NextApiRequest, NextApiResponse } from "next";
import { Chat, Prisma, PrismaClient } from "@prisma/client";
import openai from "../../lib/openai";
import { ChatCompletionRequestMessage } from "openai";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const dialogId = data["dialogId"];
  if (!dialogId) {
    return res.status(400).json({ message: "dialogId is not" });
  }
  const dialog = await prisma.dialog.findUnique({
    where: {
      id: dialogId,
    },
    include: {
      chat: true,
    },
  });
  const listChat: Chat[] = dialog.chat;
  const message: ChatCompletionRequestMessage[] = listChat
    .sort((a, b) => a.commitDate.valueOf() - b.commitDate.valueOf())
    .map((chat) => {
      return {
        role: chat.role as any,
        content: chat.text,
      };
    });
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
    });
    const listChatAI: Chat[] = [];
    const chatAI: Prisma.ChatCreateInput[] = response.data.choices.map(
      (message) => {
        return {
          role: message.message.role,
          text: message.message.content,
          dialog: {
            connect: {
              id: dialogId,
            },
          },
        };
      }
    );
    for (let index = 0; index < chatAI.length; index += 1) {
      listChatAI.push(await prisma.chat.create({ data: chatAI[index] }));
    }
    res.status(200).json(listChatAI);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

export default handler;
