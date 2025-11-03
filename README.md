# Arithmetic Sprint - Deployment Guide

This guide provides the steps to deploy your application to the web using GitHub and Firebase Hosting. This method does not require you to run any commands on your own computer.

## The Goal

To publish your application to a live URL (e.g., `arithmetic-sprint.web.app`) that you can share with students and teachers.

## The Method

We will store your code in a GitHub repository and connect Firebase directly to it. When connected, Firebase will automatically build and publish your site.

---

### Step 1: Create a GitHub Repository

1.  Go to [GitHub](https://github.com/) and sign in or create a free account.
2.  Create a **New Repository**.
    *   You can name it `arithmetic-sprint`.
    *   Make sure it is **Public**.
    *   You do **not** need to add a README, .gitignore, or license.
    *   Click **"Create repository"**.

### Step 2: Add Your Code Files to GitHub

Now, you will manually create each file from this project inside your new GitHub repository.

1.  In your new GitHub repository, click the **"Add file"** button and select **"Create new file"**.
2.  For the first file, type `package.json` as the filename.
3.  Copy the entire content of the `package.json` file from this project and paste it into the editor on GitHub.
4.  Click the **"Commit new file"** button.
5.  **Repeat this process for every single file in this project**, including `index.html`, `App.tsx`, `services/firebaseService.ts`, etc. You will end up with the exact same set of files in your GitHub repository.

### Step 3: Connect Firebase to Your GitHub Repository

1.  Go to your **[Firebase Console](https://console.firebase.google.com/)** and select your `arithmetic-sprint` project.
2.  In the left-hand menu, go to **Build > Hosting**.
3.  Click **"Get started"**.
4.  You will see a step about the Firebase CLI. **Ignore it.** Instead, look for an option to connect to a source like GitHub. Click **"Next"** or find the "Set up your GitHub integration" link.
5.  Choose **"Connect to GitHub"**.
6.  A new window will open. Authorize Firebase to access your GitHub account and select your new `arithmetic-sprint` repository.

### Step 4: Configure and Deploy

1.  Once you select the repository, Firebase will ask you to configure the deployment settings.
2.  When it asks for the **build script**, enter: `npm install && npm run build`
3.  When it asks for the **deployment directory**, enter: `dist`
4.  Check the box to **"Deploy on every push to the main branch"**.
5.  Click **"Save"**.

That's it! Firebase will now automatically pull your code from GitHub, run the build process, and deploy your application. The first deployment may take a few minutes.

Once it's finished, you will see your live **Hosting URL** right there on the Firebase Hosting dashboard. You can now share this link with anyone.
