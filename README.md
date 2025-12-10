# Portfolio Website

This portfolio website showcases my work, skills, and experience as a Software Engineer specializing in Data and Machine Learning. The site is built using Astro, featuring a modern dark design with a focus on usability and aesthetics.

## Project Structure

The project is organized as follows:

```
portfolio-site/
├── public/
│   ├── resumes/                # Contains PDF versions of my resume
│   ├── og/                     # Open Graph images for social media sharing
│   └── images/                 # Images used throughout the site
├── src/
│   ├── pages/                  # Contains the main pages of the site
│   ├── layouts/                # Layout components for consistent design
│   ├── components/             # Reusable components for the site
│   ├── lib/                    # Utility functions and libraries
│   └── styles/                 # CSS styles for the site
├── content/                    # Markdown and CSV content for the site
├── .github/                    # GitHub Actions workflows for CI/CD
├── package.json                # NPM configuration and dependencies
├── astro.config.mjs           # Astro framework configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                   # Project documentation
```

## Features

- **Dark Modern Design**: A sleek and modern interface with a dark theme, using high contrast colors for readability.
- **Dynamic Content**: Projects are displayed dynamically by fetching README files from GitHub repositories.
- **Resume Viewer**: Users can view and download different versions of my resume.
- **Contact Form**: A contact form that submits issues directly to my GitHub repository for easy communication.
- **Responsive Design**: The site is fully responsive, ensuring a great experience on mobile, tablet, and desktop devices.

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/USERNAME/portfolio-site.git
   ```
2. Navigate to the project directory:
   ```
   cd portfolio-site
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

Visit `http://localhost:3000` in your browser to view the site.

## Deployment

This portfolio is deployed using GitHub Pages. Changes pushed to the `main` branch will automatically trigger a build and deploy process through GitHub Actions.

## Acknowledgments

- Inspired by modern portfolio designs and best practices in web development.
- Built with a focus on accessibility and SEO to ensure a wide reach.

Feel free to explore the site and reach out through the contact form for any inquiries!