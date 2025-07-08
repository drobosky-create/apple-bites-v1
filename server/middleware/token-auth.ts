import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

export interface TokenAuthRequest extends Request {
  accessToken?: {
    token: string;
    type: "basic" | "growth";
    ghlContactId?: string;
  };
}

export const tokenAuth = (requiredType?: "basic" | "growth") => {
  return async (req: TokenAuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.query.token as string;
      
      if (!token) {
        return res.status(401).json({ 
          error: "Access token required", 
          message: "This assessment requires a valid access token" 
        });
      }
      
      const accessToken = await storage.validateAccessToken(token);
      
      if (!accessToken) {
        return res.status(401).json({ 
          error: "Invalid or expired token", 
          message: "The access token is invalid or has expired" 
        });
      }
      
      // Check if token type matches required type
      if (requiredType && accessToken.type !== requiredType) {
        return res.status(403).json({ 
          error: "Insufficient access", 
          message: `This assessment requires ${requiredType} access` 
        });
      }
      
      // Track token usage without marking as used (tokens can be reused until expiry)
      // Only track IP and user agent for security monitoring
      // Note: Tokens remain valid for multiple uses within their expiration period
      
      // Add token info to request object
      req.accessToken = {
        token: accessToken.token,
        type: accessToken.type,
        ghlContactId: accessToken.ghlContactId || undefined
      };
      
      next();
    } catch (error) {
      console.error("Token authentication error:", error);
      res.status(500).json({ 
        error: "Authentication failed", 
        message: "Unable to validate access token" 
      });
    }
  };
};