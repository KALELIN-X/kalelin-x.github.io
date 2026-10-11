import { readFileSync } from "node:fs";

const errors = [];
function text(value, path) {
  if (typeof value !== "string" || !value.trim())
    errors.push(`${path} must be a nonempty string.`);
}
function list(value, path, fields) {
  if (!Array.isArray(value) || !value.length) {
    errors.push(`${path} must be a nonempty array.`);
    return [];
  }
  const ids = new Set();
  return value.filter((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`${path}[${index}] must be an object.`);
      return false;
    }
    for (const field of fields) text(item[field], `${path}[${index}].${field}`);
    if (fields.includes("id")) {
      if (ids.has(item.id)) errors.push(`${path}: duplicate id "${item.id}".`);
      ids.add(item.id);
    }
    return true;
  });
}
function stringList(value, path) {
  if (!Array.isArray(value) || !value.length)
    errors.push(`${path} must be a nonempty array of strings.`);
  else value.forEach((item, index) => text(item, `${path}[${index}]`));
}
function url(value, path) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password)
      throw new Error();
  } catch {
    errors.push(`${path} must be an HTTPS URL without embedded credentials.`);
  }
}

try {
  const content = JSON.parse(
    readFileSync(
      new URL("../src/content/portfolio.json", import.meta.url),
      "utf8",
    ),
  );
  for (const field of ["name", "github", "primaryExperienceId"])
    text(content.profile?.[field], `profile.${field}`);
  url(content.profile?.github, "profile.github");
  if (content.profile?.linkedin !== undefined)
    url(content.profile.linkedin, "profile.linkedin");
  const jobs = list(content.experience, "experience", [
    "id",
    "role",
    "employer",
    "date",
    "summary",
  ]);
  if (!jobs.some((job) => job.id === content.profile?.primaryExperienceId))
    errors.push("profile.primaryExperienceId must match a role in experience.");
  jobs.forEach((job, index) => {
    if (typeof job.current !== "boolean")
      errors.push(`experience[${index}].current must be true or false.`);
    stringList(job.responsibilities, `experience[${index}].responsibilities`);
    stringList(job.tags, `experience[${index}].tags`);
  });
  list(content.education, "education", [
    "id",
    "institution",
    "degree",
    "date",
    "status",
    "chapter",
    "shortDescription",
  ]);
  list(content.projects, "projects", [
    "id",
    "number",
    "title",
    "category",
    "summary",
    "description",
    "url",
    "question",
    "approach",
    "provenance",
    "limitation",
  ]).forEach((project, index) => {
    url(project.url, `projects[${index}].url`);
    stringList(project.tags, `projects[${index}].tags`);
  });
  list(content.skillGroups, "skillGroups", ["title"]).forEach((group, index) =>
    stringList(group.items, `skillGroups[${index}].items`),
  );
} catch (error) {
  errors.push(`Cannot read portfolio content: ${error.message}`);
}

if (errors.length) {
  console.error(
    `Fix src/content/portfolio.json before building:\n${errors.map((message) => `- ${message}`).join("\n")}`,
  );
  process.exitCode = 1;
} else console.log("Portfolio content is valid.");
