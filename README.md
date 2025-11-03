
# Arithmetic Sprint - Deployment Guide

This guide provides the steps to deploy your application to the web using GitHub and Firebase Hosting. This method is secure and does not require you to run any commands on your own computer.

## The Goal

To publish your application to a live URL (e.g., `arithmetic-sprint.web.app`) that you can share with students and teachers, without exposing your secret API Key.

---

### Step 1: Create a GitHub Repository

1.  Go to [GitHub](https://github.com/) and sign in or create a free account.
2.  Create a **New Repository**.
    *   You can name it `arithmetic-sprint`.
    *   Make sure it is **Public**.
    *   Click **"Create repository"**.

### Step 2: Add Your Code Files to GitHub

Now, you will manually create each file from this project inside your new GitHub repository. **This is very important.**

1.  In your new GitHub repository, click the **"Add file"** button and select **"Create new file"**.
2.  For the first file, type `.gitignore` as the filename.
3.  Copy the entire content of the `.gitignore` file from this project and paste it into the editor on GitHub.
4.  Click the **"Commit new file"** button.
5.  **Repeat this process for every single file in this project**, including `package.json`, `index.html`, `App.tsx`, and the now-updated `services/firebaseService.ts`.

### Step 3: Connect Firebase to Your GitHub Repository

1.  Go to your **[Firebase Console](https://console.firebase.google.com/)** and select your `arithmetic-sprint` project.
2.  In the left-hand menu, go to **Build > Hosting**.
3.  Click **"Get started"**.
4.  When you see the step about the Firebase CLI, **ignore it.** Click **"Next"**.
5.  You will see an option to "Deploy a new site". Choose **"Connect to GitHub"**.
6.  A new window will open. Authorize Firebase to access your GitHub account and select your `arithmetic-sprint` repository.

### Step 4: Securely Add Your API Key to Firebase

This is the most important new step for security.

1.  After connecting your repository, Firebase will show you the deployment settings.
2.  Look for a section called **"Environment variables"**.
3.  Click **"Add variable"**.
4.  In the **Variable name** box, type exactly: `VITE_FIREBASE_API_KEY`
5.  In the **Value** box, paste your full API key (it starts with `AIzaSy...`).
6.  Click **"Add"** to save the variable.

### Step 5: Configure and Deploy

1.  Now, configure the build settings in that same view.
2.  For the **build script**, enter: `npm install && npm run build`
3.  For the **deployment directory**, enter: `dist`
4.  Check the box to **"Deploy on every push to the main branch"**.
5.  Click **"Save and deploy"**.

Firebase will now automatically pull your code, securely inject your API key, build the application, and deploy it. The first deployment may take a few minutes.

Once it's finished, you will see your live **Hosting URL** right there on the Firebase Hosting dashboard.
