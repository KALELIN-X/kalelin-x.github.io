import content from "./content/portfolio.json";

// One source for the page and printable résumé. See README for editing guidance.
export const { experience, education, projects, skillGroups } = content;
const primaryRole = experience.find(
  (job) => job.id === content.profile.primaryExperienceId,
);
export const profile = {
  ...content.profile,
  role: primaryRole.role,
  employer: primaryRole.employer,
};
