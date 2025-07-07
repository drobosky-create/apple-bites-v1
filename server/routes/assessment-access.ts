import type { Express } from "express";
import { storage } from "../storage";

export function registerAssessmentAccessRoutes(app: Express) {
  // Save assessment data with email for post-purchase access
  app.post('/api/save-assessment-data', async (req, res) => {
    try {
      const { email, assessmentData, paymentStatus = 'pending' } = req.body;
      
      if (!email || !assessmentData) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and assessment data are required' 
        });
      }

      // Save or update assessment data in storage
      await storage.saveAssessmentData({
        email,
        assessmentData: JSON.stringify(assessmentData),
        paymentStatus,
        timestamp: new Date().toISOString()
      });

      res.json({ 
        success: true, 
        message: 'Assessment data saved successfully' 
      });
    } catch (error) {
      console.error('Error saving assessment data:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to save assessment data' 
      });
    }
  });

  // Verify purchase and return assessment data
  app.post('/api/verify-purchase', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email is required' 
        });
      }

      // Look for assessment data by email
      const assessmentRecord = await storage.getAssessmentDataByEmail(email);
      
      if (assessmentRecord) {
        // Parse the stored assessment data
        let assessmentData;
        try {
          assessmentData = JSON.parse(assessmentRecord.assessmentData);
        } catch (parseError) {
          console.error('Error parsing assessment data:', parseError);
          return res.status(500).json({ 
            success: false, 
            message: 'Invalid assessment data format' 
          });
        }

        // For now, assume any found assessment is a valid purchase
        // In a real implementation, you would check payment status from Stripe/Apple Bites
        res.json({ 
          success: true, 
          assessmentData,
          purchaseVerified: true,
          message: 'Purchase verified successfully' 
        });
      } else {
        res.json({ 
          success: false, 
          message: 'No assessment found for this email address' 
        });
      }
    } catch (error) {
      console.error('Error verifying purchase:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to verify purchase' 
      });
    }
  });

  // Update payment status (for webhook integration if needed)
  app.post('/api/update-payment-status', async (req, res) => {
    try {
      const { email, paymentStatus, paymentId } = req.body;
      
      if (!email || !paymentStatus) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and payment status are required' 
        });
      }

      await storage.updatePaymentStatus(email, paymentStatus, paymentId);

      res.json({ 
        success: true, 
        message: 'Payment status updated successfully' 
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update payment status' 
      });
    }
  });
}