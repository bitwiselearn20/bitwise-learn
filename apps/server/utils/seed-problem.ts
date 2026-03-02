import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import prismaClient from "./prisma";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedProblem() {
  const filePath = path.join(__dirname, "../data/problem-questions.json");
  let data = await fs.readFile(filePath, "utf-8");
  data = JSON.parse(data);

  for (let i = 0; i < data.length; i++) {
    let currentProblem = data[i] as any;

    const dbProblem = await prismaClient.problem.create({
      data: {
        name: currentProblem.name,
        description: currentProblem.description,
        hints: currentProblem.hints,
        difficulty: currentProblem.difficulty as any,
        createdBy: currentProblem.createdBy.$oid,
        creatorType: "SUPERADMIN",
        published: "NOT_LISTED",
        problemTopics: {
          create: {
            tagName: currentProblem.topic,
          },
        },
      },
    });

    console.log(`problem created : ${dbProblem.name}`);
  }
}

seedProblem();
