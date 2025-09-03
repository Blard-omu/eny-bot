import { Request, Response, NextFunction } from 'express';
import PortalService from '../services/portal.service';

export default class ChatController {
  static async proxyChatToAICore(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, userId } = req.body;
      const { answer, confidence } = await PortalService.proxyChatToAICore(query, userId || req.user?._id);
      
      // Store chat history if user is authenticated
      if (req.user?._id) {
        await PortalService.storeChatHistory(req.user._id, query, answer, confidence);
      }
      
      // Trigger escalation if confidence is low
      if (confidence < 0.7) {
        await PortalService.createEscalation(query, req.body.userEmail || 'anonymous@enyconsulting.ca');
        return res.status(201).json({ message: 'Query escalated to human support', answer });
      }

      res.status(200).json({ answer, confidence });
    } catch (error) {
      next(error);
    }
  }

  static async createEscalation(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, userEmail } = req.body;
      const escalation = await PortalService.createEscalation(query, userEmail);
      res.status(201).json(escalation);
    } catch (error) {
      next(error);
    }
  }

  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, query } = req.body;
      const lead = await PortalService.createLead(email, query);
      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  }

  static async storeChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, query, response, confidence } = req.body;
      const chatHistory = await PortalService.storeChatHistory(userId, query, response, confidence);
      res.status(201).json(chatHistory);
    } catch (error) {
      next(error);
    }
  }

  static async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;
      const chatHistory = await PortalService.getChatHistory(userId as string);
      res.status(200).json(chatHistory);
    } catch (error) {
      next(error);
    }
  }

  static async getAllEscalations(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const escalations = await PortalService.getAllEscalations(Number(page), Number(limit));
      res.status(200).json(escalations);
    } catch (error) {
      next(error);
    }
  }
}