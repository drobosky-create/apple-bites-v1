import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getAuditHistory } from '../services/auditService';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const { entityType, entityId, limit } = req.query;
    const auditLogs = await getAuditHistory(
      entityType as string, 
      entityId as string, 
      parseInt(limit as string) || 100
    );
    res.json(auditLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;