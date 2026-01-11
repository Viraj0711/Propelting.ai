"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
// Upload meeting file
router.post('/upload', auth_1.authenticate, upload_1.upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { title, description, participants } = req.body;
        // Parse participants if it's a JSON string
        let parsedParticipants = [];
        if (participants) {
            try {
                parsedParticipants = typeof participants === 'string'
                    ? JSON.parse(participants)
                    : participants;
            }
            catch (e) {
                console.error('Error parsing participants:', e);
            }
        }
        // Create meeting record
        const meeting = await prisma_1.default.meeting.create({
            data: {
                title: title || req.file.originalname,
                description: description || '',
                participants: parsedParticipants,
                audioUrl: `/uploads/meetings/${req.file.filename}`,
                fileSize: req.file.size,
                userId: req.user.userId,
                status: 'PROCESSING'
            }
        });
        // In a real app, you would trigger background processing here
        // For now, we'll just mark it as completed after a delay
        setTimeout(async () => {
            try {
                await prisma_1.default.meeting.update({
                    where: { id: meeting.id },
                    data: {
                        status: 'COMPLETED',
                        duration: 300 // 5 minutes placeholder
                    }
                });
            }
            catch (error) {
                console.error('Error updating meeting status:', error);
            }
        }, 2000);
        res.status(201).json({
            data: meeting,
            message: 'File uploaded successfully. Processing started.'
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to upload file'
        });
    }
});
// Create meeting (without file)
router.post('/', auth_1.authenticate, [
    (0, express_validator_1.body)('title').notEmpty(),
    (0, express_validator_1.body)('description').optional(),
    (0, express_validator_1.body)('participants').optional().isArray()
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, participants } = req.body;
        const meeting = await prisma_1.default.meeting.create({
            data: {
                title,
                description,
                participants: participants || [],
                userId: req.user.userId,
                status: 'UPLOADING'
            }
        });
        res.status(201).json(meeting);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create meeting' });
    }
});
// List meetings
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const meetings = await prisma_1.default.meeting.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            include: {
                actionItems: {
                    select: { id: true, status: true }
                }
            }
        });
        res.json(meetings);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch meetings' });
    }
});
// Get meeting by ID
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const meeting = await prisma_1.default.meeting.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.userId
            },
            include: {
                transcript: true,
                summary: true,
                actionItems: true
            }
        });
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.json(meeting);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch meeting' });
    }
});
// Update meeting
router.patch('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const meeting = await prisma_1.default.meeting.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        });
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        const updated = await prisma_1.default.meeting.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update meeting' });
    }
});
// Delete meeting
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const meeting = await prisma_1.default.meeting.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        });
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        await prisma_1.default.meeting.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Meeting deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete meeting' });
    }
});
exports.default = router;
//# sourceMappingURL=meetings.js.map