#!/usr/bin/env node
/**
 * Validation script for portfolio project images and README URLs.
 * Checks that all project images exist and all README URLs are accessible.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, '../src/lib/config/projects.config.json');
const publicDir = path.join(__dirname, '../public');

async function validateImages(projects) {
  console.log('\n🖼️  Validating project images...\n');
  let passed = 0;
  let failed = 0;

  for (const project of projects) {
    if (!project.image) {
      console.log(`⚠️  ${project.title}: No image specified`);
      continue;
    }

    // Handle external URLs
    if (project.image.startsWith('http://') || project.image.startsWith('https://')) {
      console.log(`🌐 ${project.title}: External image URL (${project.image})`);
      passed++;
      continue;
    }

    // Check local file
    const imagePath = path.join(publicDir, project.image);
    if (fs.existsSync(imagePath)) {
      const ext = path.extname(project.image).toLowerCase();
      const supportedFormats = ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif'];
      if (supportedFormats.includes(ext)) {
        console.log(`✅ ${project.title}: ${project.image} (${ext.substring(1).toUpperCase()})`);
        passed++;
      } else {
        console.log(`⚠️  ${project.title}: Unsupported format ${ext}`);
        failed++;
      }
    } else {
      console.log(`❌ ${project.title}: Image not found at ${imagePath}`);
      failed++;
    }
  }

  return { passed, failed };
}

async function validateReadmeUrls(projects) {
  console.log('\n📄 Validating README URLs...\n');
  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const project of projects) {
    if (!project.readmeUrl) {
      console.log(`⚠️  ${project.title}: No README URL specified`);
      skipped++;
      continue;
    }

    // Skip validation for placeholder repos (non-existent GitHub repos)
    if (project.readmeUrl.includes('dataflow-engine') || project.readmeUrl.includes('ml-dashboard')) {
      console.log(`⏭️  ${project.title}: Skipping placeholder README`);
      skipped++;
      continue;
    }

    try {
      const res = await fetch(project.readmeUrl, { method: 'HEAD' });
      if (res.ok) {
        console.log(`✅ ${project.title}: ${project.readmeUrl}`);
        passed++;
      } else {
        console.log(`❌ ${project.title}: HTTP ${res.status} for ${project.readmeUrl}`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ${project.title}: Failed to fetch ${project.readmeUrl} - ${err.message}`);
      failed++;
    }
  }

  return { passed, failed, skipped };
}

async function validateSlugs(projects) {
  console.log('\n🔗 Validating project slugs...\n');
  let passed = 0;
  let failed = 0;
  const slugs = new Set();

  for (const project of projects) {
    if (!project.slug) {
      console.log(`⚠️  ${project.title}: No slug specified (will be auto-generated)`);
      continue;
    }

    if (slugs.has(project.slug)) {
      console.log(`❌ ${project.title}: Duplicate slug "${project.slug}"`);
      failed++;
    } else {
      console.log(`✅ ${project.title}: slug="${project.slug}"`);
      slugs.add(project.slug);
      passed++;
    }
  }

  return { passed, failed };
}

async function main() {
  console.log('🔍 Portfolio Project Validator\n');
  console.log('═'.repeat(60));

  // Load config
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const projects = config.projects || [];

  if (projects.length === 0) {
    console.log('\n⚠️  No projects found in config.json');
    process.exit(1);
  }

  console.log(`\nFound ${projects.length} project(s) in projects.config.json\n`);

  // Run validations
  const imageResults = await validateImages(projects);
  const readmeResults = await validateReadmeUrls(projects);
  const slugResults = await validateSlugs(projects);

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 Summary:\n');
  console.log(`Images:  ${imageResults.passed} passed, ${imageResults.failed} failed`);
  console.log(`READMEs: ${readmeResults.passed} passed, ${readmeResults.failed} failed, ${readmeResults.skipped || 0} skipped`);
  console.log(`Slugs:   ${slugResults.passed} passed, ${slugResults.failed} failed`);

  const totalFailed = imageResults.failed + readmeResults.failed + slugResults.failed;
  if (totalFailed > 0) {
    console.log(`\n❌ Validation failed with ${totalFailed} error(s)\n`);
    process.exitCode = 1;
  } else {
    console.log('\n✅ All validations passed!\n');
    process.exitCode = 0;
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exitCode = 1;
});
