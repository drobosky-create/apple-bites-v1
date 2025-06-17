# Apple Bites Business Assessment - Domain Integration Guide

## Quick Setup (5 minutes)

### Method 1: Direct File Upload
1. **Access your hosting control panel** (cPanel, Plesk, or hosting dashboard)
2. **Navigate to File Manager** → public_html folder
3. **Upload** the `standalone-calculator.html` file
4. **Rename** to `business-assessment.html` (optional)
5. **Test**: Visit `https://yourdomain.com/business-assessment.html`

### Method 2: Subdomain (Recommended)
1. **Create subdomain**: `assessment.yourdomain.com`
2. **Upload file** as `index.html` in subdomain folder
3. **Result**: Clean URL at `https://assessment.yourdomain.com`

### Method 3: Custom Page Integration
1. **Create new page** on your website
2. **Embed calculator** using iframe or direct HTML
3. **SEO-friendly** with proper page structure

## DNS & SSL
- **SSL Certificate**: Automatically handled by most hosts
- **CDN**: Consider Cloudflare for faster loading
- **Cache**: Disable caching for the calculator page

## Testing Checklist
- [ ] All form steps work properly
- [ ] EBITDA calculations update in real-time
- [ ] Grade selections function correctly
- [ ] Generate Report button submits to GoHighLevel
- [ ] Mobile responsiveness on various devices
- [ ] SSL certificate active (https://)

## Maintenance
- **Backup**: Save the HTML file locally
- **Updates**: Replace file when modifications needed
- **Monitoring**: Check GoHighLevel integration monthly