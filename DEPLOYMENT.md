# Deployment Guide

## Deploy Your Feature Branch for Review

### Method 1: GitHub PR Preview

This creates a **separate preview environment** just for your PR without affecting the main dev environment.

#### Steps:

1. **Commit and push your feature branch:**

   ```bash
   git add -A
   git commit -m "Homepage redesign with VT branding and AWS integration"
   git push origin feature/homepage-and-static-pages
   ```

2. **Create a Pull Request on GitHub:**

   - Go to: https://github.com/vt-digital-libraries-platform/dlp-access-next
   - Click "Pull Requests" → "New Pull Request"
   - Select your branch: `feature/homepage-and-static-pages`

3. **Add the "Deploy preview" label:**

   - On your PR page, click "Labels" in the right sidebar
   - Add the label: `Deploy preview`

4. **GitHub Actions will automatically:**

   - Build your Docker image
   - Create a unique preview environment: `pr-[NUMBER]-preview-dlp-access-next`
   - Deploy to AWS Elastic Beanstalk
   - Comment on your PR with the preview URL

5. **Share the URL** with other developers!

### Existing Environment

- **Current Dev Environment:** `dlp-access-next-dev`
- **URL:**
- **Status:** Running

## Sensitive Files Protected

The following files are **automatically ignored** by git :

- `aws-exports.js` - AWS Amplify configuration
- `set-eb-env.sh` - Environment variables
- `.env*` - All environment files
- `amplify/team-provider-info.json` - Amplify team settings
- All AWS/Amplify credential files
