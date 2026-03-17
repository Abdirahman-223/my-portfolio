# Deployment Guide: Portfolio to Netlify

Follow these steps to deploy your portfolio website.

## Method 1: Netlify Drag & Drop (Fastest)

1. **Go to Netlify**: Visit [app.netlify.com](https://app.netlify.com/).
2. **Log In**: Sign in with your GitHub account (or create one).
3. **Sites**: Go to the "Sites" tab.
4. **Drag & Drop**: Find the folder `c:\my portfolio` on your computer.
5. **Upload**: Drag the entire `my portfolio` folder and drop it into the "Deploy" area on Netlify.
6. **Done**: Your site will be live in seconds!

## Method 2: Git & GitHub (Professional / Recommended)

This method allows your site to update automatically whenever you make changes.

### Step 1: Initialize Git
Run these commands in your terminal (I can help with this):
```bash
git init
git add .
git commit -m "Initial commit: Ready for deployment"
```

### Step 2: Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new) named `my-portfolio`.
2. Link your local project to GitHub:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/my-portfolio.git
git branch -M main
git push -u origin main
```

### Step 3: Connect to Netlify
1. On [Netlify](https://app.netlify.com/), click **"Add new site"** -> **"Import an existing project"**.
2. Select **GitHub**.
3. Choose your `my-portfolio` repository.
4. Click **"Deploy site"**.

---
**Tip**: Once deployed, you can change your site's URL in the Netlify dashboard (Site settings > Change site name).
