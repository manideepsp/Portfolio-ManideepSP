// Re-export all config modules for easy importing
// Usage: import { site, about, experience, projects } from '../lib/config';

import site from './config/site.config.json';
import about from './config/about.config.json';
import experience from './config/experience.config.json';
import projects from './config/projects.config.json';

// Backward compatibility: merge into a single config object
const config = {
  ...site,
  about,
  experience: experience.entries,
  experienceSettings: experience.settings,
  projects: projects.projects
};

export { site, about, experience, projects };
export default config;
