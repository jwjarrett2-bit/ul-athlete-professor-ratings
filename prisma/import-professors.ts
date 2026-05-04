import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const csvPath = path.join(process.cwd(), "data", "ul-professors.csv");
const requiredHeaders = [
  "firstName",
  "lastName",
  "fullName",
  "department",
  "college",
  "email",
  "title",
  "sourceUrl"
] as const;

type ProfessorCsvRow = Record<(typeof requiredHeaders)[number], string>;

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (character === "," && !insideQuotes) {
      values.push(value.trim());
      value = "";
      continue;
    }

    value += character;
  }

  values.push(value.trim());
  return values;
}

function parseCsv(content: string) {
  const lines = content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const headers = parseCsvLine(lines[0]);
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

  if (missingHeaders.length) {
    throw new Error(`Missing required CSV column(s): ${missingHeaders.join(", ")}`);
  }

  return lines.slice(1).map((line, lineIndex) => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as ProfessorCsvRow;

    if (!row.firstName || !row.lastName || !row.fullName || !row.department || !row.college) {
      throw new Error(`Row ${lineIndex + 2} is missing firstName, lastName, fullName, department, or college.`);
    }

    return row;
  });
}

function optionalValue(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

async function main() {
  const csv = await readFile(csvPath, "utf8");
  const rows = parseCsv(csv);

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const existingProfessor = await prisma.professor.findUnique({
      where: {
        fullName_department: {
          fullName: row.fullName.trim(),
          department: row.department.trim()
        }
      }
    });

    if (existingProfessor) {
      skipped += 1;
      continue;
    }

    await prisma.professor.create({
      data: {
        firstName: row.firstName.trim(),
        lastName: row.lastName.trim(),
        fullName: row.fullName.trim(),
        department: row.department.trim(),
        college: row.college.trim(),
        email: optionalValue(row.email),
        title: optionalValue(row.title),
        sourceUrl: optionalValue(row.sourceUrl)
      }
    });

    created += 1;
  }

  console.log(`Professor import complete: ${created} created, ${skipped} skipped.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
