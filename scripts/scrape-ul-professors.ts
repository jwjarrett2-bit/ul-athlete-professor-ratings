import { writeFile } from "node:fs/promises";
import path from "node:path";
import axios from "axios";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

type DepartmentPage = {
  department: string;
  college: string;
  url: string;
};

type ScrapedProfessor = {
  firstName: string;
  lastName: string;
  fullName: string;
  department: string;
  college: string;
  email: string;
  title: string;
  sourceUrl: string;
};

const departmentPages: DepartmentPage[] = [
  { department: "Architecture & Design", college: "College of the Arts", url: "https://louisiana.edu/architecture/about-school-architecture-design/school-architecture-design-directory" },
  { department: "Dance & Theatre", college: "College of the Arts", url: "https://louisiana.edu/dancetheatre/about-school-dance-theatre/dance-theatre-directory" },
  { department: "Music", college: "College of the Arts", url: "https://louisiana.edu/music/about-school-music/school-music-directory" },
  { department: "Visual Arts", college: "College of the Arts", url: "https://louisiana.edu/visualarts/about-school-visual-arts/visual-arts-directory" },
  { department: "Accounting", college: "B.I. Moody III College of Business Administration", url: "https://accounting.louisiana.edu/about-us/faculty-staff" },
  { department: "Economics & Finance", college: "B.I. Moody III College of Business Administration", url: "https://economics.louisiana.edu/about-us/faculty-staff-0" },
  { department: "Management", college: "B.I. Moody III College of Business Administration", url: "https://management.louisiana.edu/about-us/faculty-staff-0" },
  { department: "Marketing", college: "B.I. Moody III College of Business Administration", url: "https://marketing.louisiana.edu/about-us/faculty-staff" },
  { department: "Educational Curriculum & Instruction", college: "College of Education & Human Development", url: "https://curriculum.louisiana.edu/about-us/faculty-staff" },
  { department: "Kinesiology", college: "College of Education & Human Development", url: "https://kinesiology.louisiana.edu/about-us/faculty-staff" },
  { department: "Chemical Engineering", college: "College of Engineering", url: "https://chemical.louisiana.edu/about-us/faculty-staff" },
  { department: "Civil & Environmental Engineering", college: "College of Engineering", url: "https://civil.louisiana.edu/about-us/faculty-staff" },
  { department: "Electrical & Computer Engineering", college: "College of Engineering", url: "https://electrical.louisiana.edu/about-us/faculty-staff" },
  { department: "Engineering and Technology Management", college: "College of Engineering", url: "https://engineeringtech.louisiana.edu/about-us/faculty-staff" },
  { department: "Mechanical Engineering", college: "College of Engineering", url: "https://mechanical.louisiana.edu/about-us/faculty-staff" },
  { department: "Petroleum Engineering", college: "College of Engineering", url: "https://petroleum.louisiana.edu/about-us/faculty-staff" },
  { department: "Communication", college: "College of Liberal Arts", url: "https://communication.louisiana.edu/about-us/faculty-staff" },
  { department: "Communicative Disorders", college: "College of Liberal Arts", url: "https://communicativedisorders.louisiana.edu/about-us/faculty-staff" },
  { department: "Criminal Justice", college: "College of Liberal Arts", url: "https://criminaljustice.louisiana.edu/about-us/faculty-staff" },
  { department: "English", college: "College of Liberal Arts", url: "https://english.louisiana.edu/about-us/faculty-staff/current-faculty-profiles" },
  { department: "History, Geography & Philosophy", college: "College of Liberal Arts", url: "https://history.louisiana.edu/about-us/faculty-staff" },
  { department: "Modern Languages", college: "College of Liberal Arts", url: "https://languages.louisiana.edu/about-us/faculty-staff" },
  { department: "Political Science", college: "College of Liberal Arts", url: "https://politicalscience.louisiana.edu/about-us/faculty-staff" },
  { department: "Psychology", college: "College of Liberal Arts", url: "https://psychology.louisiana.edu/about-us/faculty-staff" },
  { department: "Sociology, Anthropology, and Human Development & Family Science", college: "College of Liberal Arts", url: "https://sociology.louisiana.edu/about-us/faculty-staff" },
  { department: "LHC Group · Myers School of Nursing", college: "College of Nursing & Health Sciences", url: "https://nursing.louisiana.edu/about-us/faculty-staff-0" },
  { department: "Health Sciences", college: "College of Nursing & Health Sciences", url: "https://healthsciences.louisiana.edu/about-us/faculty-staff" },
  { department: "Biological Sciences", college: "Ray P. Authement College of Sciences", url: "https://biology.louisiana.edu/about-us/faculty-staff" },
  { department: "Chemistry", college: "Ray P. Authement College of Sciences", url: "https://chemistry.louisiana.edu/about-us/faculty-staff" },
  { department: "Computing & Informatics", college: "Ray P. Authement College of Sciences", url: "https://computing.louisiana.edu/about-us/faculty-staff-0" },
  { department: "Geosciences", college: "Ray P. Authement College of Sciences", url: "https://geos.louisiana.edu/about-us/faculty-staff" },
  { department: "Mathematics", college: "Ray P. Authement College of Sciences", url: "https://math.louisiana.edu/about-us/people/faculty" },
  { department: "Physics", college: "Ray P. Authement College of Sciences", url: "https://physics.louisiana.edu/about-us/faculty-staff" },
  { department: "Special Services", college: "University College", url: "https://studentsupport.louisiana.edu/about-us/staff" },
  { department: "Honors Program", college: "University College", url: "https://louisiana.edu/honors/about-us" }
];

const outputPath = path.join(process.cwd(), "data", "ul-professors.csv");
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const titlePattern = /\b(professor|instructor|lecturer|department head|dean|coordinator|director|chair|faculty|advisor)\b/i;
const ignoredNamePattern =
  /^(about us|academic programs|curriculum|courses|current students|news|events|awards|recognition|contact|give|apply|visit|menu|search)$/i;

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isLikelyName(value: string) {
  if (!value || value.length < 4 || value.length > 90) return false;
  if (emailPattern.test(value)) return false;
  if (/[0-9]/.test(value)) return false;
  if (ignoredNamePattern.test(value)) return false;
  if (/about us|academic programs|current students|news & events|curriculum & courses/i.test(value)) return false;
  if (titlePattern.test(value) && value.split(/\s+/).length > 5) return false;
  if (/faculty|staff|department|college|office|contact|profile|research/i.test(value)) return false;
  return value.split(/\s+/).length >= 2;
}

function splitName(fullName: string) {
  const parts = fullName
    .replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.|Professor)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);

  return {
    firstName: parts[0] ?? fullName,
    lastName: parts.length > 1 ? parts[parts.length - 1] : ""
  };
}

function extractEmail($container: cheerio.Cheerio<AnyNode>) {
  const mailto = $container.find('a[href^="mailto:"]').first().attr("href");
  if (mailto) return cleanText(mailto.replace(/^mailto:/i, "").split("?")[0]);

  const match = cleanText($container.text()).match(emailPattern);
  return match?.[0] ?? "";
}

function extractTitle($container: cheerio.Cheerio<AnyNode>, fullName: string) {
  const selectors = [
    ".title",
    ".field--name-field-title",
    ".views-field-field-title",
    ".position",
    ".job-title",
    ".faculty-title",
    "[class*='title']",
    "[class*='position']"
  ];

  for (const selector of selectors) {
    const title = cleanText($container.find(selector).first().text());
    if (title && title !== fullName && titlePattern.test(title)) return title;
  }

  const lines = $container.text().split(/\n|\r/).map(cleanText).filter(Boolean);
  return lines.find((line) => line !== fullName && !emailPattern.test(line) && titlePattern.test(line)) ?? "";
}

function extractName($container: cheerio.Cheerio<AnyNode>) {
  const selectors = [
    "h2",
    "h3",
    "h4",
    ".views-field-title a",
    ".field--name-title",
    ".field-content a",
    "a[href*='/directory/people']"
  ];

  for (const selector of selectors) {
    const text = cleanText($container.find(selector).first().text());
    if (isLikelyName(text)) return text;
  }

  return $container.text().split(/\n|\r/).map(cleanText).filter(Boolean).find(isLikelyName) ?? "";
}

function candidateContainers($: cheerio.CheerioAPI) {
  const selectors = [
    ".views-row",
    ".node--type-person",
    ".person",
    ".profile",
    ".faculty-card",
    ".faculty-member",
    ".staff-member",
    "article",
    "tr"
  ];
  const containers: AnyNode[] = [];
  const seen = new Set<AnyNode>();

  for (const selector of selectors) {
    $(selector).each((_, element) => {
      const $element = $(element);
      const text = cleanText($element.text());

      const hasPersonLink = $element.find("a[href*='/directory/people']").length > 0;
      const hasEmail = emailPattern.test(text) || $element.find('a[href^="mailto:"]').length > 0;
      const hasFacultyClass = /views-row|person|profile|faculty|staff/i.test($element.attr("class") ?? "");

      if (!seen.has(element) && text && (hasEmail || hasPersonLink || hasFacultyClass)) {
        seen.add(element);
        containers.push(element);
      }
    });
  }

  return containers;
}

function scrapeDepartment(html: string, page: DepartmentPage) {
  const $ = cheerio.load(html);
  const professors: ScrapedProfessor[] = [];

  for (const element of candidateContainers($)) {
    const $container = $(element);
    const fullName = extractName($container);

    if (!fullName) continue;

    const { firstName, lastName } = splitName(fullName);

    professors.push({
      firstName,
      lastName,
      fullName,
      department: page.department,
      college: page.college,
      email: extractEmail($container),
      title: extractTitle($container, fullName),
      sourceUrl: page.url
    });
  }

  return professors;
}

function dedupe(professors: ScrapedProfessor[]) {
  const seen = new Set<string>();
  const deduped: ScrapedProfessor[] = [];

  for (const professor of professors) {
    const key = `${professor.fullName.toLowerCase()}::${professor.department.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(professor);
  }

  return deduped;
}

function csvEscape(value: string) {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

function toCsv(professors: ScrapedProfessor[]) {
  const headers = ["firstName", "lastName", "fullName", "department", "college", "email", "title", "sourceUrl"];
  const rows = professors.map((professor) =>
    headers.map((header) => csvEscape(professor[header as keyof ScrapedProfessor] ?? "")).join(",")
  );

  return `${headers.join(",")}\n${rows.join("\n")}${rows.length ? "\n" : ""}`;
}

async function main() {
  if (process.argv.includes("--help")) {
    console.log("Usage: npm run scrape:professors");
    console.log("Writes scraped faculty data to data/ul-professors.csv.");
    return;
  }

  const scraped: ScrapedProfessor[] = [];

  for (const page of departmentPages) {
    try {
      const response = await axios.get<string>(page.url, {
        timeout: 15000,
        headers: {
          "User-Agent": "UL Athlete Professor Ratings local development scraper"
        },
        validateStatus: (status) => status >= 200 && status < 400
      });

      const professors = scrapeDepartment(response.data, page);

      if (!professors.length) {
        console.warn(`Warning: no faculty members extracted for ${page.department} from ${page.url}`);
      } else {
        console.log(`${page.department}: extracted ${professors.length}`);
      }

      scraped.push(...professors);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: could not scrape ${page.department} from ${page.url}: ${message}`);
    }
  }

  const deduped = dedupe(scraped);
  await writeFile(outputPath, toCsv(deduped), "utf8");

  const countsByDepartment = new Map<string, number>();

  for (const page of departmentPages) {
    countsByDepartment.set(page.department, 0);
  }

  for (const professor of deduped) {
    countsByDepartment.set(professor.department, (countsByDepartment.get(professor.department) ?? 0) + 1);
  }

  console.log("\nSummary by department:");
  for (const page of departmentPages) {
    console.log(`${page.department}: ${countsByDepartment.get(page.department) ?? 0} professors`);
  }

  console.log(`Wrote ${deduped.length} unique professors to data/ul-professors.csv`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
