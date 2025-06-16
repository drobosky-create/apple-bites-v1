# Meritage Partners Business Valuation Tool - Deployment Guide

## Quick Deployment Steps

### 1. Deploy on Replit
1. Click the "Deploy" button in your Replit interface
2. Choose "Autoscale" deployment for best performance
3. Your app will be live at: `https://[your-repl-name].[your-username].replit.app`

### 2. Get Your Live URL
After deployment, your URL will be something like:
- `https://meritage-valuation.yourusername.replit.app`
- `https://business-valuation.yourusername.replit.app`

### 3. Update Embed Codes
Replace `YOUR_REPLIT_URL` in the embed files with your actual URL.

## Embed Options

### Option 1: Simple iframe (Recommended)
```html
<iframe 
    src="https://YOUR_ACTUAL_URL.replit.app" 
    width="100%" 
    height="800" 
    frameborder="0"
    style="border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);"
    title="Business Valuation Tool">
</iframe>
```

### Option 2: Landing Page Embed
Use the `embed-code-final.html` file as a standalone landing page that links to your tool.

### Option 3: Full Integration
Copy the valuation form directly into your existing website and update API endpoints.

## Custom Domain (Optional)
1. In Replit, go to your deployment settings
2. Add your custom domain (e.g., `valuation.meritage-partners.com`)
3. Update DNS records as instructed
4. Update embed codes with your custom domain

## Security Considerations
- All form submissions are encrypted
- Lead data is stored securely in PostgreSQL
- GoHighLevel integration is authenticated
- No sensitive data exposed in frontend

## Testing
1. Test the form submission flow
2. Verify email delivery
3. Check GoHighLevel integration
4. Test admin dashboard access
5. Validate PDF generation

## Support
- Admin login: `admin@applebites.com` / `AdminPassword123!`
- Team login: `drobosky@meritage-partners.com` / `password123`
- Database: PostgreSQL with automatic backups
- All integrations configured and tested

Your business valuation tool is ready for production deployment!