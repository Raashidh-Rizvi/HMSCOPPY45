import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, Plus, Send, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

interface Announcement {
    id: number;
    title: string;
    content: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    createdBy: string;
    createdAt: string;
    expiresAt?: string;
    targetRoles: string[];
    read: boolean;
}

const AnnouncementSystem: React.FC = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showAnnouncementPanel, setShowAnnouncementPanel] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchAnnouncements();
        // Poll for new announcements every 30 seconds
        const interval = setInterval(fetchAnnouncements, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAnnouncements = async () => {
        try {
            // Simulate fetching announcements
            const mockAnnouncements: Announcement[] = [
                {
                    id: 1,
                    title: 'System Maintenance Scheduled',
                    content: 'The hospital management system will undergo maintenance on Sunday from 2 AM to 4 AM. Please save your work before this time.',
                    priority: 'HIGH',
                    createdBy: 'System Administrator',
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    targetRoles: ['ALL'],
                    read: false
                },
                {
                    id: 2,
                    title: 'New Safety Protocols',
                    content: 'Please review the updated safety protocols in the staff handbook. All staff must complete the safety training by end of week.',
                    priority: 'MEDIUM',
                    createdBy: 'System Administrator',
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    targetRoles: ['DOCTOR', 'NURSE'],
                    read: true
                }
            ];

            // Filter announcements based on user role
            const filteredAnnouncements = mockAnnouncements.filter(
                ann => ann.targetRoles.includes('ALL') || ann.targetRoles.includes(user?.role || '')
            );

            setAnnouncements(filteredAnnouncements);
            setUnreadCount(filteredAnnouncements.filter(ann => !ann.read).length);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const createAnnouncement = async (announcementData: any) => {
        try {
            const newAnnouncement = {
                ...announcementData,
                createdBy: user?.name || 'Administrator'
            };

            const response = await api.post('/announcements', newAnnouncement);

            setShowCreateDialog(false);
            fetchAnnouncements(); // Refresh the list
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Error creating announcement. Please try again.');
        }
    };

    const markAsRead = async (id: number) => {
        setAnnouncements(prev =>
            prev.map(ann => ann.id === id ? { ...ann, read: true } : ann)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await api.patch(`/announcements/${id}/read`);
        } catch (error) {
            console.error('Error marking announcement as read:', error);
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'URGENT':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'HIGH':
                return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case 'MEDIUM':
                return <Info className="w-4 h-4 text-blue-500" />;
            default:
                return <CheckCircle className="w-4 h-4 text-green-500" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT':
                return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
            case 'HIGH':
                return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
            case 'MEDIUM':
                return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
            default:
                return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
        }
    };

    return (
        <>
            {/* Bell Icon Badge */}
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm animate-pulse"></span>
            )}
            
            {/* Click handler for bell icon */}
            <div 
                className="absolute inset-0 cursor-pointer"
                onClick={() => setShowAnnouncementPanel(!showAnnouncementPanel)}
            />

            {/* Announcements Panel */}
            <AnimatePresence>
                {showAnnouncementPanel && (
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        className="fixed top-16 right-6 z-50 w-96 h-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center space-x-2">
                                    <Megaphone className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Announcements
                                    </h3>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {user?.role === 'ADMINISTRATOR' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowCreateDialog(true)}
                                            className="w-8 h-8"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowAnnouncementPanel(false)}
                                        className="w-8 h-8"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Announcements List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {announcements.length === 0 ? (
                                    <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                                        <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No announcements</p>
                                    </div>
                                ) : (
                                    announcements.map(announcement => (
                                        <motion.div
                                            key={announcement.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-3 rounded-lg border-l-4 ${getPriorityColor(announcement.priority)} ${
                                                !announcement.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                                            }`}
                                            onClick={() => !announcement.read && markAsRead(announcement.id)}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {getPriorityIcon(announcement.priority)}
                                                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                                                        {announcement.title}
                                                    </h4>
                                                </div>
                                                {!announcement.read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                {announcement.content}
                                            </p>
                                            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                                <span>{announcement.createdBy}</span>
                                                <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Announcement Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Announcement</DialogTitle>
                    </DialogHeader>
                    <AnnouncementForm onSubmit={createAnnouncement} onCancel={() => setShowCreateDialog(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
};

const AnnouncementForm: React.FC<{
    onSubmit: (data: any) => void;
    onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'MEDIUM',
        targetRoles: ['ALL'],
        expiresAt: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Announcement title"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Announcement content"
                    className="w-full p-2 border rounded-md h-24 resize-none"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="targetRoles">Target Roles</Label>
                <select
                    id="targetRoles"
                    value={formData.targetRoles[0]}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetRoles: [e.target.value] }))}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="ALL">All Staff</option>
                    <option value="DOCTOR">Doctors</option>
                    <option value="NURSE">Nurses</option>
                    <option value="RECEPTIONIST">Receptionists</option>
                    <option value="PHARMACIST">Pharmacists</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Announcement
                </Button>
            </div>
        </form>
    );
};

export default AnnouncementSystem;