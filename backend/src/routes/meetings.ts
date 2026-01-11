import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const meetings = await prisma.meeting.findMany({
      where: { userId: req.userId! },
      include: {
        actionItems: true
      }
    });

    const totalMeetings = meetings.length;
    const totalDuration = meetings.reduce((sum, m) => sum + (m.duration || 0), 0);
    const avgDuration = totalMeetings > 0 ? Math.round(totalDuration / totalMeetings) : 0;

    const totalActionItems = meetings.reduce((sum, m) => sum + m.actionItems.length, 0);
    const avgActionItems = totalMeetings > 0 ? (totalActionItems / totalMeetings).toFixed(1) : '0';

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const monthlyMeetings = meetings.filter(m => m.createdAt >= sixMonthsAgo);
    const monthMap = new Map<string, number>();

    monthlyMeetings.forEach(meeting => {
      const month = new Date(meeting.createdAt).toLocaleDateString('en-US', { month: 'short' });
      monthMap.set(month, (monthMap.get(month) || 0) + 1);
    });

    const trends = Array.from(monthMap.entries()).map(([month, count]) => ({
      month,
      count
    }));

    const participantMap = new Map<string, number>();
    meetings.forEach(meeting => {
      const participants = meeting.participants as string[];
      if (Array.isArray(participants)) {
        participants.forEach((participant: string) => {
          participantMap.set(participant, (participantMap.get(participant) || 0) + 1);
        });
      }
    });

    const topParticipants = Array.from(participantMap.entries())
      .map(([name, meetingCount]) => ({ name, meetingCount }))
      .sort((a, b) => b.meetingCount - a.meetingCount)
      .slice(0, 5);

    res.json({
      totalMeetings,
      completedMeetings: meetings.filter(m => m.status === 'COMPLETED').length,
      processingMeetings: meetings.filter(m => m.status === 'PROCESSING').length,
      totalDuration,
      avgDuration,
      avgActionItems: parseFloat(avgActionItems),
      trends,
      topParticipants
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [meetings, total] = await Promise.all([
      prisma.meeting.findMany({
        where: { userId: req.userId! },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { actionItems: true }
          }
        }
      }),
      prisma.meeting.count({ where: { userId: req.userId! } })
    ]);

    res.json({
      data: meetings,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ message: 'Failed to fetch meetings' });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      },
      include: {
        actionItems: true
      }
    });

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({ message: 'Failed to fetch meeting' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, duration, participants } = req.body;

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        duration,
        participants: participants || [],
        userId: req.userId!,
        status: 'COMPLETED'
      }
    });

    res.status(201).json(meeting);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ message: 'Failed to create meeting' });
  }
});

router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, status } = req.body;

    const meeting = await prisma.meeting.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const updated = await prisma.meeting.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(status && { status })
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({ message: 'Failed to update meeting' });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!
      }
    });

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    await prisma.meeting.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({ message: 'Failed to delete meeting' });
  }
});

export default router;
