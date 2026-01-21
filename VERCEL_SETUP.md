# Vercel Deployment Setup Guide

## Environment Variables
This project uses the **Google Gemini API**. To ensure it works correctly in production (Vercel), you must configure your environment variables carefully.

### 1. Recommended Method (Robust)
In your Vercel Project Settings:
1. Go to **Settings** > **Environment Variables**.
2. Add a new variable:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** `your_actual_google_api_key`
3. Hit **Save**.
4. **Redeploy** your application (Environment variables are only baked in at build time).

> **Why `VITE_` prefix?**
> Vite-based projects require environment variables to be prefixed with `VITE_` to be exposed to the client-side browser code securely.

### 2. Manual Fallback
If for any reason the environment variable fails to load:
1. Open the deployed application.
2. You will see an **"API Key Required"** modal.
3. Paste your Gemini API key directly into the input.
4. This key will be saved locally in your browser (`localStorage`) and used for future requests.

## Troubleshooting
- **"API configuration is incomplete"**: This means `VITE_GEMINI_API_KEY` was not found during the build AND no key is in local storage.
- **403/401 Errors**: Your API key might be invalid or quota exceeded. Check Google AI Studio dashboard.
