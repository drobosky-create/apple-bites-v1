# Apple Bites Calculator - Domain Hosting Instructions

## Quick Deployment

### File Upload Method
1. **Download**: Save `standalone-calculator.html` from project
2. **Access Hosting**: Login to your hosting control panel
3. **Upload Location**: Place in `public_html` or `www` folder
4. **URL Structure**: `https://yourdomain.com/standalone-calculator.html`

### Professional Setup
**Recommended filename**: `business-assessment.html`
**Final URL**: `https://yourdomain.com/business-assessment.html`

## Domain Configuration

### DNS Settings (if using subdomain)
```
Type: A Record or CNAME
Name: assessment
Points to: Your hosting server IP
TTL: 3600
```

### SSL Certificate
- Most hosts auto-provision SSL
- Verify https:// works after upload
- Contact hosting support if SSL issues occur

## Testing Protocol
1. **Form Navigation**: Test all 6 steps
2. **Calculations**: Verify EBITDA math updates
3. **Submissions**: Confirm GoHighLevel integration
4. **Mobile**: Test on various screen sizes
5. **Performance**: Check loading speed

## Maintenance
- **Backup**: Keep local copy of HTML file
- **Updates**: Replace file when modifications needed
- **Monitoring**: Verify GoHighLevel webhook monthly

## Support Contacts
- **Hosting Issues**: Contact your hosting provider
- **Domain Problems**: Contact your domain registrar
- **Calculator Issues**: Reference this documentation