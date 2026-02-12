# Security Policy

## Supported Versions

This project currently supports the following version(s) with security updates and patches:

| Version | Status | Release Date | Support Until |
|---------|--------|--------------|----------------|
| 1.0.x | Active | 2024 | TBD |

### Version Support Matrix

- **Active Development**: Latest version receives all security patches and feature updates
- **Long-Term Support (LTS)**: Designated versions receive security patches for extended periods
- **End of Life (EOL)**: Versions no longer receive any updates or support

> **Note**: Users are strongly encouraged to upgrade to the latest version to ensure they have the most recent security patches and features.

## Reporting a Vulnerability

We take security vulnerabilities seriously and appreciate responsible disclosure. If you discover a security vulnerability, **please do not open a public GitHub issue**. Instead, report it discreetly using one of the following methods:

### Option 1: GitHub Security Advisory (Recommended)
1. Navigate to the **Security** tab of this repository
2. Click **Report a vulnerability**
3. Fill out the vulnerability report form with:
   - Title describing the vulnerability
   - Description of the issue
   - Steps to reproduce (if applicable)
   - Impact assessment
   - Suggested remediation (if available)

### Option 2: Email
Send a detailed security report to:
```
security@[your-domain].com
```

Include the following information in your report:
- **Subject**: `[SECURITY] Vulnerability Report - [Brief Title]`
- **Description**: Clear explanation of the vulnerability
- **Steps to Reproduce**: How to trigger or verify the issue
- **Affected Component(s)**: Which part of the application is affected
- **Severity Assessment**: Your assessment (Critical, High, Medium, Low)
- **Proof of Concept** (optional): Technical demonstration
- **Contact Information**: How we can reach you with updates

### Response Timeline

We commit to the following response timeline:

| Severity | Initial Response | Resolution Target |
|----------|------------------|-------------------|
| **Critical** | 24 hours | 7 days |
| **High** | 48 hours | 14 days |
| **Medium** | 1 week | 30 days |
| **Low** | 2 weeks | 90 days |

## Security Best Practices

### For Users

1. **Keep Dependencies Updated**: Regularly run `npm update` to get latest patches
   ```bash
   npm outdated  # Check for outdated packages
   npm update    # Update to latest versions
   ```

2. **Environment Variables**: Never commit `.env` files to version control
   - Use `.env.local` for local development
   - Use secure secret management in production (Azure Key Vault, AWS Secrets Manager, etc.)

3. **API Keys**: Rotate API keys regularly
   - Google Gemini API Key: Update every 90 days
   - Database credentials: Rotate periodically
   - JWT Secret: Keep secure and rotate if compromised

4. **Database Security**: 
   - Use strong MongoDB credentials
   - Enable authentication and authorization
   - Use connection encryption (TLS/SSL)
   - Regularly backup data

5. **HTTPS**: Always use HTTPS in production
   - Enable HSTS (HTTP Strict Transport Security)
   - Use valid SSL/TLS certificates

### For Developers

1. **Code Review**: All code changes must be reviewed before merging
2. **Testing**: Run security tests before deployment
   ```bash
   npm run lint
   npm run test
   ```

3. **Dependency Scanning**: 
   ```bash
   npm audit              # Check for vulnerabilities
   npm audit --fix       # Automatically fix issues
   npm audit --json      # Detailed report
   ```

4. **Secrets Management**: Use environment variables for sensitive data
5. **Input Validation**: Validate all user inputs
6. **Output Encoding**: Properly encode output to prevent XSS attacks

## Security Features Implemented

### In Transit Encryption
-  HTTPS/TLS support for all API communications
-  JWT tokens for secure authentication
-  CORS configuration for origin validation
-  Secure headers with Helmet.js

### Application Security
-  Rate limiting (100 requests per IP per 15 minutes)
-  Input validation with express-validator
-  Password hashing with bcryptjs (10 salt rounds)
-  JWT token expiration (7 days)
-  MongoDB authentication

### Data Protection
-  Database connection encryption
-  Secure password storage
-  User authentication and authorization
-  Response sanitization

## Security Scanning

This project is regularly scanned for vulnerabilities using:

- **npm audit**: Regular dependency vulnerability checking
- **Trivy**: Container and dependency scanning
- **GitHub Security**: Automated vulnerability detection
- **Code Analysis**: Static code analysis for security issues

### View Security Reports

Security scan reports are maintained in the `/trivy` directory:
- `trivy/trivy-report.json` - Latest security scan results

## Incident Response

In case of a confirmed security vulnerability:

1. **Acknowledgment**: We will confirm receipt within 24 hours
2. **Investigation**: We will investigate the reported issue
3. **Patch Development**: A security patch will be developed
4. **Testing**: The patch will be thoroughly tested
5. **Release**: A new version with the patch will be released
6. **Disclosure**: A security advisory will be published (with your permission)
7. **Notification**: Users will be notified of the security update

## Security Update Notifications

To stay informed about security updates:

1. **Watch Releases**: Enable release notifications on GitHub
2. **Subscribe to Security Advisories**: Monitor GitHub Security Advisories
3. **Check Changelog**: Review [CHANGELOG.md](CHANGELOG.md) for security-related updates

## Compliance and Standards

This project follows these security standards and best practices:

-  OWASP Top 10 guidelines
-  Node.js security best practices
-  MongoDB security recommendations
-  JWT security standards (RFC 7519)
-  REST API security best practices

## Contact

For security concerns or to report a vulnerability, please contact:

- **GitHub Security Advisory**: Use the built-in vulnerability report form
- **Email**: [security contact to be configured]
- **Response Time**: We aim to respond to all security reports within 24 hours

---

**Last Updated**: February 2026  
**Version**: 1.0.0

For general support and non-security issues, please use the GitHub Issues page or refer to [README.md](README.md).
