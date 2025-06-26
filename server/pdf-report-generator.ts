import puppeteer from 'puppeteer';
import { ValuationAssessment } from '@shared/schema';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface ReportData extends ValuationAssessment {
  companySize?: string;
  industry?: string;
  naicsCode?: string;
  sicCode?: string;
  foundedYear?: string;
}

export async function generateComprehensiveValuationPDF(assessment: ReportData): Promise<Buffer> {
  // Ensure reports directory exists
  const reportsDir = join(process.cwd(), 'public', 'reports');
  try {
    await fs.mkdir(reportsDir, { recursive: true });
  } catch (error) {
    console.log('Reports directory already exists or could not be created');
  }

  // Get the correct chromium path
  let executablePath: string | undefined;
  try {
    const { stdout } = await execAsync('which chromium');
    executablePath = stdout.trim();
  } catch (error) {
    console.error('Could not find chromium executable:', error);
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 1600 });
    
    const htmlContent = generateInvestorGradeHTML(assessment);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      preferCSSPageSize: true
    });

    // Save to public/reports directory
    const filename = `valuation-report-${assessment.id}-${Date.now()}.pdf`;
    const filepath = join(reportsDir, filename);
    await fs.writeFile(filepath, pdfBuffer);
    console.log(`PDF report saved to: ${filepath}`);

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

function getMeritageLogoBase64(): string {
  try {
    const logoPath = join(process.cwd(), 'attached_assets', 'Meritage Logo2.png');
    if (existsSync(logoPath)) {
      const logoBuffer = readFileSync(logoPath);
      return `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }
  } catch (error) {
    console.error('Could not load Meritage logo:', error);
  }
  
  // Enhanced SVG fallback logo
  const svgLogo = `<svg width="240" height="80" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="240" height="80" fill="white" stroke="#1e40af" stroke-width="2" rx="4"/>
    <text x="120" y="32" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1e40af" text-anchor="middle">MERITAGE</text>
    <text x="120" y="52" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#f59e0b" text-anchor="middle">PARTNERS</text>
    <circle cx="25" cy="40" r="15" fill="#1e40af" opacity="0.1"/>
    <circle cx="215" cy="40" r="15" fill="#f59e0b" opacity="0.1"/>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svgLogo).toString('base64')}`;
}

function generateValuationSliderSVG(overallScore: string | null): string {
  const gradeToPosition = {
    'A': 85,
    'B': 68,
    'C': 51,
    'D': 34,
    'F': 17
  };
  
  const position = gradeToPosition[overallScore as keyof typeof gradeToPosition] || 51;
  
  return `<svg width="400" height="80" viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sliderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
        <stop offset="25%" style="stop-color:#ea580c;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#0891b2;stop-opacity:1" />
        <stop offset="75%" style="stop-color:#0d9488;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- Background track -->
    <rect x="20" y="25" width="360" height="30" rx="15" fill="url(#sliderGradient)" />
    
    <!-- Grade labels -->
    <text x="35" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151" text-anchor="middle">F</text>
    <text x="107" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151" text-anchor="middle">D</text>
    <text x="179" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151" text-anchor="middle">C</text>
    <text x="251" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151" text-anchor="middle">B</text>
    <text x="323" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#374151" text-anchor="middle">A</text>
    
    <!-- Current position indicator -->
    <circle cx="${20 + (position / 100) * 360}" cy="40" r="12" fill="white" stroke="#1f2937" stroke-width="3"/>
    <circle cx="${20 + (position / 100) * 360}" cy="40" r="6" fill="#1f2937"/>
    
    <!-- Current grade label -->
    <text x="200" y="70" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1f2937" text-anchor="middle">Your Current Grade: ${overallScore}</text>
  </svg>`;
}

function generateBellCurveSVG(valuationMultiple: string | null): string {
  const multiple = valuationMultiple ? parseFloat(valuationMultiple) || 3.0 : 3.0;
  
  return `<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bellCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#1e40af;stop-opacity:0.3" />
      </linearGradient>
    </defs>
    
    <!-- Bell curve path -->
    <path d="M 50 150 Q 200 50 350 150" stroke="#1e40af" stroke-width="3" fill="url(#bellCurveGradient)" fill-opacity="0.3"/>
    
    <!-- Your position marker -->
    <line x1="${50 + (multiple - 1) * 75}" y1="40" x2="${50 + (multiple - 1) * 75}" y2="160" stroke="#dc2626" stroke-width="3"/>
    <circle cx="${50 + (multiple - 1) * 75}" cy="${150 - Math.exp(-Math.pow((multiple - 3) / 1.5, 2)) * 80}" r="6" fill="#dc2626"/>
    
    <!-- X-axis labels -->
    <text x="50" y="175" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">1.0x</text>
    <text x="125" y="175" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">2.0x</text>
    <text x="200" y="175" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">3.0x</text>
    <text x="275" y="175" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">4.0x</text>
    <text x="350" y="175" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">5.0x</text>
    
    <!-- Labels -->
    <text x="200" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1f2937" text-anchor="middle">Industry Valuation Multiples</text>
    <text x="${50 + (multiple - 1) * 75}" y="190" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">Your Multiple: ${multiple}x</text>
  </svg>`;
}

function generateInvestorGradeHTML(assessment: ReportData): string {
  const formatCurrency = (value: string | null) => {
    if (!value) return '$0';
    const numValue = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return new Date().toLocaleDateString();
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': return '#059669';
      case 'B': return '#0d9488';
      case 'C': return '#0891b2';
      case 'D': return '#ea580c';
      case 'F': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const valueDrivers = [
    { name: 'Financial Performance', grade: assessment.financialPerformance },
    { name: 'Customer Concentration', grade: assessment.customerConcentration },
    { name: 'Management Team', grade: assessment.managementTeam },
    { name: 'Competitive Position', grade: assessment.competitivePosition },
    { name: 'Growth Prospects', grade: assessment.growthProspects },
    { name: 'Systems & Processes', grade: assessment.systemsProcesses },
    { name: 'Asset Quality', grade: assessment.assetQuality },
    { name: 'Industry Outlook', grade: assessment.industryOutlook },
    { name: 'Risk Factors', grade: assessment.riskFactors },
    { name: 'Owner Dependency', grade: assessment.ownerDependency }
  ];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Valuation Report - ${assessment.company}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: white;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            padding: 0;
        }
        
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            min-height: 140px;
        }
        
        .logo {
            position: absolute;
            top: 20px;
            left: 30px;
            max-height: 80px;
            max-width: 240px;
        }
        
        .header h1 {
            margin: 30px 0 10px 0;
            font-size: 32px;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .header .subtitle {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        
        .header .date {
            font-size: 14px;
            opacity: 0.8;
        }
        
        .content {
            padding: 30px;
        }
        
        .executive-summary {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 6px solid #1e40af;
        }
        
        .company-info {
            background: #fefefe;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 2px solid #e5e7eb;
        }
        
        .company-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .info-label {
            font-weight: 600;
            color: #4b5563;
        }
        
        .info-value {
            color: #1f2937;
            font-weight: 500;
        }
        
        .valuation-summary {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            border: 2px solid #bfdbfe;
            text-align: center;
        }
        
        .valuation-range {
            display: flex;
            justify-content: space-around;
            margin: 25px 0;
            align-items: end;
        }
        
        .valuation-item {
            text-align: center;
            flex: 1;
        }
        
        .valuation-amount {
            font-size: 22px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 8px;
        }
        
        .valuation-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 600;
        }
        
        .primary-amount {
            font-size: 36px !important;
            color: #0f172a !important;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            border: 3px solid #1e40af;
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
        }
        
        .section {
            margin-bottom: 35px;
            page-break-inside: avoid;
        }
        
        .section h2 {
            color: #1e40af;
            border-bottom: 3px solid #e2e8f0;
            padding-bottom: 12px;
            margin-bottom: 20px;
            font-size: 24px;
            font-weight: bold;
        }
        
        .section h3 {
            color: #374151;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .metric-card {
            background: #fefefe;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
            text-align: center;
        }
        
        .metric-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
        }
        
        .value-drivers-container {
            background: #fefefe;
            padding: 25px;
            border-radius: 12px;
            border: 2px solid #e5e7eb;
        }
        
        .driver-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 20px;
        }
        
        .driver-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f9fafb;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        
        .driver-name {
            font-weight: 600;
            color: #374151;
        }
        
        .grade {
            font-weight: bold;
            padding: 6px 12px;
            border-radius: 6px;
            color: white;
            font-size: 14px;
            min-width: 35px;
            text-align: center;
        }
        
        .chart-container {
            text-align: center;
            margin: 25px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        }
        
        .narrative-section {
            background: #fefefe;
            padding: 25px;
            border-radius: 12px;
            border: 2px solid #e5e7eb;
            line-height: 1.8;
        }
        
        .action-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 12px;
        }
        
        .action-button {
            background: #1e40af;
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .action-button.secondary {
            background: #0891b2;
        }
        
        .footer {
            background: #f8fafc;
            padding: 25px;
            text-align: center;
            margin-top: 40px;
            border-top: 3px solid #e5e7eb;
        }
        
        .footer-content {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .contact-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
            text-align: left;
        }
        
        .disclaimer {
            font-size: 11px;
            color: #6b7280;
            margin-top: 20px;
            text-align: left;
            line-height: 1.5;
            padding: 15px;
            background: #f9fafb;
            border-radius: 6px;
            border-left: 4px solid #fbbf24;
        }
        
        @media print {
            .page { margin: 0; }
            .content { padding: 20px; }
            .section { page-break-inside: avoid; }
            .action-buttons { display: none; }
        }
        
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <img src="${getMeritageLogoBase64()}" alt="Meritage Partners Logo" class="logo">
            <h1>Business Valuation Report</h1>
            <div class="subtitle">Comprehensive Analysis & Strategic Assessment</div>
            <div class="date">Report Generated: ${formatDate(assessment.createdAt)}</div>
        </div>
        
        <div class="content">
            <div class="executive-summary">
                <h2 style="margin-top: 0; color: #1e40af; border: none; padding: 0;">Executive Summary</h2>
                <p style="font-size: 16px; margin: 15px 0;">
                    ${assessment.executiveSummary || `This comprehensive valuation report for ${assessment.company} provides a detailed analysis of the business value based on financial performance, market position, and operational excellence. Our assessment indicates an estimated value range of ${formatCurrency(assessment.lowEstimate)} to ${formatCurrency(assessment.highEstimate)}, with a most likely value of ${formatCurrency(assessment.midEstimate)}.`}
                </p>
            </div>
            
            <div class="company-info">
                <h2 style="margin-top: 0; color: #374151; border: none; padding: 0;">Company Information</h2>
                <div class="company-info-grid">
                    <div>
                        <div class="info-item">
                            <span class="info-label">Company Name:</span>
                            <span class="info-value">${assessment.company}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Industry:</span>
                            <span class="info-value">${assessment.industry || 'Not specified'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">NAICS Code:</span>
                            <span class="info-value">${assessment.naicsCode || 'Not specified'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Founded:</span>
                            <span class="info-value">${assessment.foundedYear || 'Not specified'}</span>
                        </div>
                    </div>
                    <div>
                        <div class="info-item">
                            <span class="info-label">Contact Person:</span>
                            <span class="info-value">${assessment.firstName} ${assessment.lastName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${assessment.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Phone:</span>
                            <span class="info-value">${assessment.phone}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Company Size:</span>
                            <span class="info-value">${assessment.companySize || 'Not specified'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="valuation-summary">
                <h2 style="margin-top: 0; color: #1e40af; border: none; padding: 0;">Estimated Business Value</h2>
                <div class="valuation-range">
                    <div class="valuation-item">
                        <div class="valuation-amount">${formatCurrency(assessment.lowEstimate)}</div>
                        <div class="valuation-label">LOW ESTIMATE</div>
                    </div>
                    <div class="valuation-item">
                        <div class="valuation-amount primary-amount">${formatCurrency(assessment.midEstimate)}</div>
                        <div class="valuation-label">MOST LIKELY VALUE</div>
                    </div>
                    <div class="valuation-item">
                        <div class="valuation-amount">${formatCurrency(assessment.highEstimate)}</div>
                        <div class="valuation-label">HIGH ESTIMATE</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Financial Performance Summary</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-label">Base EBITDA</div>
                        <div class="metric-value">${formatCurrency(assessment.baseEbitda)}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Adjusted EBITDA</div>
                        <div class="metric-value">${formatCurrency(assessment.adjustedEbitda)}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Valuation Multiple</div>
                        <div class="metric-value">${assessment.valuationMultiple}x</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Overall Score</div>
                        <div class="metric-value">Grade ${assessment.overallScore}</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Valuation Performance Scale</h2>
                <div class="chart-container">
                    ${generateValuationSliderSVG(assessment.overallScore)}
                </div>
                <p style="text-align: center; margin-top: 15px; color: #6b7280;">
                    Your business currently scores a Grade ${assessment.overallScore} based on our comprehensive assessment across ten key value drivers.
                </p>
            </div>
            
            <div class="section page-break">
                <h2>Value Driver Assessment</h2>
                <div class="value-drivers-container">
                    <p style="margin-bottom: 20px; color: #6b7280;">
                        Each category is graded from A (excellent) to F (needs improvement) based on industry benchmarks and best practices.
                    </p>
                    <div class="driver-grid">
                        ${valueDrivers.map(driver => `
                            <div class="driver-item">
                                <span class="driver-name">${driver.name}</span>
                                <span class="grade" style="background-color: ${getGradeColor(driver.grade)}">${driver.grade}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Industry Benchmark Analysis</h2>
                <div class="chart-container">
                    ${generateBellCurveSVG(assessment.valuationMultiple || "3.0")}
                </div>
                <p style="text-align: center; margin-top: 15px; color: #6b7280;">
                    Your valuation multiple of ${assessment.valuationMultiple}x compared to industry standards. This chart shows the distribution of typical valuation multiples for businesses in your sector.
                </p>
            </div>
            
            ${assessment.narrativeSummary ? `
            <div class="section">
                <h2>Strategic Analysis & Recommendations</h2>
                <div class="narrative-section">
                    <p>${assessment.narrativeSummary}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="action-buttons">
                <button class="action-button">Schedule Consultation Call</button>
                <button class="action-button secondary">Explore Value Enhancement</button>
            </div>
            
            <div class="footer">
                <div class="footer-content">
                    <h3 style="color: #1e40af; margin-bottom: 15px;">Meritage Partners</h3>
                    <p style="font-weight: 600; margin-bottom: 10px;">Business Valuation & Strategic Advisory</p>
                    
                    <div class="contact-info">
                        <div>
                            <p><strong>Phone:</strong> (555) 123-4567</p>
                            <p><strong>Email:</strong> info@meritageadvisors.com</p>
                        </div>
                        <div>
                            <p><strong>Website:</strong> www.meritageadvisors.com</p>
                            <p><strong>Report ID:</strong> VAL-${assessment.id}-${new Date().getFullYear()}</p>
                        </div>
                    </div>
                    
                    <div class="disclaimer">
                        <p><strong>Important Disclaimer:</strong> This valuation report is provided for informational and strategic planning purposes only. It should not be considered as a formal business appraisal or used for legal, tax, or transaction purposes without additional verification. The estimates are based on information provided by the client and industry benchmarks current as of the report date. Actual business value may vary significantly based on market conditions, due diligence findings, buyer motivations, and other factors not captured in this assessment. For formal valuation certificates or transaction support, please consult with our certified business appraisers.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}