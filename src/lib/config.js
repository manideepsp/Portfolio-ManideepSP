// Re-export all config modules for easy importing
// Usage: import { site, about, experience, projects } from '../lib/config';

import site from './config/site.config.json';
import about from './config/about.config.json';
import experience from './config/experience.config.json';
import projects from './config/projects.config.json';

// Backward compatibility: merge into a single config object
// Flatten companies->projects into entries format for legacy components
const flattenedExperience = experience.companies?.flatMap(company => 
  company.projects.map(project => ({
    ...project,
    company: company.name,
    companyLink: company.link
  }))
) || [];

const config = {
  ...site,
  about,
  experience: flattenedExperience,
  experienceSettings: experience.settings,
  experienceCompanies: experience.companies,
  projects: projects.projects
};

export { site, about, experience, projects };
export default config;
