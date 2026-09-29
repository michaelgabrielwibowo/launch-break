<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6a16093f-80f8-4919-8945-dabf72854318

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Credential handling

Keep Gemini and other backend API keys in ignored local environment files or a deployment secret store. Commit only empty or clearly placeholder examples. Do not put backend keys in client bundles, comments, logs, issues, or archives. Keep service-account private keys outside the repository. `.gitignore` does not remove tracked files or old commits. Revoke any exposed key and check usage and billing. Firebase web API keys are client identifiers; restrict them to required Firebase APIs and exclude the Generative Language API. Use a separate backend Gemini key. See [Google credential response](https://docs.cloud.google.com/docs/security/compromised-credentials) and [Firebase API key guidance](https://firebase.google.com/docs/projects/api-keys).
