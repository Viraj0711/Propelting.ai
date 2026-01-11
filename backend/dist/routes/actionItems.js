"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Create action item
router.post('/', auth_1.authenticate, [
    (0, express_validator_1.body)('meetingId').notEmpty(),
    (0, express_validator_1.body)('title').notEmpty(),
    (0, express_validator_1.body)('description').optional(),
    (0, express_validator_1.body)('assignee').optional(),
    (0, express_validator_1.body)('dueDate').optional().isISO8601(),
    (0, express_validator_1.body)('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { meetingId, title, description, assignee, dueDate, priority } = req.body;
        // Verify meeting ownership
        const meeting = await prisma_1.default.meeting.findFirst({
            where: {
                id: meetingId,
                userId: req.user.userId
            }
        });
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        const actionItem = await prisma_1.default.actionItem.create({
            data: {
                meetingId,
                userId: req.user.userId,
                title,
                description,
                assignee,
                dueDate: dueDate ? new Date(dueDate) : null,
                priority: priority || 'medium',
                status: 'PENDING'
            }
        });
        res.status(201).json(actionItem);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create action item' });
    }
});
// List action items
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const { status, priority } = req.query;
        const actionItems = await prisma_1.default.actionItem.findMany({
            where: {
                userId: req.user.userId,
                ...(status && { status: status }),
                ...(priority && { priority: priority })
            },
            orderBy: { createdAt: 'desc' },
            include: {
                meeting: {
                    select: { id: true, title: true }
                }
            }
        });
        res.json(actionItems);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch action items' });
    }
});
// Get action item by ID
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const actionItem = await prisma_1.default.actionItem.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.userId
            },
            include: {
                meeting: {
                    select: { id: true, title: true }
                }
            }
        });
        if (!actionItem) {
            return res.status(404).json({ message: 'Action item not found' });
        }
        res.json(actionItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch action item' });
    }
});
// Update action item
router.patch('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const actionItem = await prisma_1.default.actionItem.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        });
        if (!actionItem) {
            return res.status(404).json({ message: 'Action item not found' });
        }
        const updated = await prisma_1.default.actionItem.update({
            where: { id: req.params.id },
            data: {
                ...req.body,
                ...(req.body.status === 'COMPLETED' && !actionItem.completedAt && {
                    completedAt: new Date()
                })
            }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update action item' });
    }
});
// Delete action item
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const actionItem = await prisma_1.default.actionItem.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        });
        if (!actionItem) {
            return res.status(404).json({ message: 'Action item not found' });
        }
        await prisma_1.default.actionItem.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Action item deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete action item' });
    }
});
exports.default = router;
//# sourceMappingURL=actionItems.js.map