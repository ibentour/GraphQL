# GitHub Pages Deployment Guide

This document provides instructions for hosting this GraphQL Skills Dashboard on GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your local machine
3. Your project files ready for deployment

## Deployment Steps

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., `skills-dashboard` or any name you prefer)
4. Choose whether to make it public or private
5. Click "Create repository"
6. Follow the instructions to push your existing repository from the command line:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your GitHub username and repository name.

### 2. Configure GitHub Pages

#### For a Project Site (Recommended)

1. Go to your GitHub repository settings
2. Scroll down to the "GitHub Pages" section
3. Select the "main" branch as the source
4. Click "Save"
5. Your site will be published at `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME`

#### For a User/Organization Site (Optional)

If you want this to be your main GitHub Pages site:

1. Create a repository named exactly `YOUR_USERNAME.github.io`
2. Push your code to this repository
3. Enable GitHub Pages in the repository settings
4. Your site will be published at `https://YOUR_USERNAME.github.io`

### 3. Check for Cross-Origin Issues

If you're using the Zone01 Oujda API, you might face CORS (Cross-Origin Resource Sharing) issues when hosting on GitHub Pages. Consider these options:

1. **Proxy solution**: Use a CORS proxy if you need to make direct API calls
2. **Backend solution**: Create a small backend service that handles the API requests and deploy it separately

### 4. Custom Domain (Optional)

If you want to use a custom domain:

1. In your repository settings, under GitHub Pages section, enter your custom domain
2. Update your DNS settings with your domain provider to point to GitHub's servers
3. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

- If your site isn't appearing, check that GitHub Pages is enabled in your repository settings
- If styles or scripts aren't loading, ensure paths are relative and correct for GitHub Pages
- If API calls fail, check for CORS issues in your browser's developer console

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [HTTPS Enforcement](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
