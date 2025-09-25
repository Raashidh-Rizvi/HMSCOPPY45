import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, X, Send, AlertCircle, CheckCircle, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

interface Feedback {
    id: number;
    user: {
        id: number;
        name: string;
        role: string;
    };
    title: string;
    content: string;
    type: 'FEEDBACK' | 'COMPLAINT';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    createdAt: string;
    resolvedAt?: string;
    adminResponse?: string;
}

const FeedbackSystem: React.FC = () => {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchFeedbacks();
        const interval = setInterval(fetchFeedbacks, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchFeedbacks = async () => {
        try {
            let response;
            if (user?.role === 'ADMINISTRATOR') {
                response = await api.get('/feedbacks');
            } else {
                response = await api.get(`/feedbacks/user/${user?.id}`);
            }
            
            setFeedbacks(response.data || []);
            
            if (user?.role !== 'ADMINISTRATOR') {
                const unread = response.data?.filter((f: Feedback) => 
                    f.status === 'RESOLVED' && !f.adminResponse
                ).length || 0;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setFeedbacks([]);
        }
    };

    const createFeedback = async (feedbackData: any) => {
        try {
            const newFeedback = {
                ...feedbackData,
                user: { id: user?.id }
            };

            await api.post('/feedbacks', newFeedback);
            setShowCreateDialog(false);
            fetchFeedbacks();
        } catch (error) {
            console.error('Error creating feedback:', error);
        }
    };

    const updateFeedbackStatus = async (id: number, status: string, adminResponse?: string) => {
        try {
            await api.patch(`/feedbacks/${id}/status`, { status, adminResponse });
            fetchFeedbacks();
            setShowDetailDialog(false);
        } catch (error) {
            console.error('Error updating feedback status:', error);
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'URGENT':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'HIGH':
                return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case 'MEDIUM':
                return <AlertCircle className="w-4 h-4 text-blue-500" />;
            default:
                return <CheckCircle className="w-4 h-4 text-green-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
            case 'IN_PROGRESS':
                return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'RESOLVED':
                return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
            case 'CLOSED':
                return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
            default:
                return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }
    };

    const getTypeColor = (type: string) => {
        return type === 'COMPLAINT' ? 'text-red-600' : 'text-blue-600';
    };

    return (
        <>
            {/* Footer Feedback Buttons */}
            <div className="flex items-center space-x-2">
                <Button
                    onClick={() => setShowFeedbackPanel(!showFeedbackPanel)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm relative"
                >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Feedback
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
                <Button
                    onClick={() => setShowCreateDialog(true)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 text-sm"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Submit
                </Button>
            </div>

            {/* Feedback Panel */}
            <AnimatePresence>
                {showFeedbackPanel && (
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        className="fixed bottom-20 right-6 z-40 w-96 h-96 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        {user?.role === 'ADMINISTRATOR' ? 'All Feedback' : 'My Feedback'}
                                    </h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowFeedbackPanel(false)}
                                    className="w-8 h-8"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {feedbacks.length === 0 ? (
                                    <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No feedback found</p>
                                    </div>
                                ) : (
                                    feedbacks.map(feedback => (
                                        <motion.div
                                            key={feedback.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-3 rounded-lg border-l-4 cursor-pointer ${getStatusColor(feedback.status)}`}
                                            onClick={() => {
                                                setSelectedFeedback(feedback);
                                                setShowDetailDialog(true);
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {getPriorityIcon(feedback.priority)}
                                                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                                                        {feedback.title}
                                                    </h4>
                                                </div>
                                                <span className={`text-xs font-medium ${getTypeColor(feedback.type)}`}>
                                                    {feedback.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                                {feedback.content}
                                            </p>
                                            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                                <span>{user?.role === 'ADMINISTRATOR' ? feedback.user.name : 'You'}</span>
                                                <div className="flex items-center space-x-2">
                                                    <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        feedback.status === 'OPEN' ? 'bg-red-100 text-red-600' :
                                                        feedback.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-600' :
                                                        feedback.status === 'RESOLVED' ? 'bg-green-100 text-green-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {feedback.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Feedback Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Submit Feedback or Complaint</DialogTitle>
                    </DialogHeader>
                    <FeedbackForm onSubmit={createFeedback} onCancel={() => setShowCreateDialog(false)} />
                </DialogContent>
            </Dialog>

            {/* Feedback Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Feedback Details</DialogTitle>
                    </DialogHeader>
                    {selectedFeedback && (
                        <FeedbackDetail 
                            feedback={selectedFeedback} 
                            onStatusUpdate={updateFeedbackStatus}
                            isAdmin={user?.role === 'ADMINISTRATOR'}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

const FeedbackForm: React.FC<{
    onSubmit: (data: any) => void;
    onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'FEEDBACK',
        priority: 'MEDIUM'
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
                    placeholder="Brief title"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="FEEDBACK">Feedback</option>
                    <option value="COMPLAINT">Complaint</option>
                </select>
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
                <Label htmlFor="content">Details</Label>
                <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Describe your feedback or complaint"
                    className="w-full p-2 border rounded-md h-24 resize-none"
                    required
                />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                </Button>
            </div>
        </form>
    );
};

const FeedbackDetail: React.FC<{
    feedback: Feedback;
    onStatusUpdate: (id: number, status: string, adminResponse?: string) => void;
    isAdmin: boolean;
}> = ({ feedback, onStatusUpdate, isAdmin }) => {
    const [adminResponse, setAdminResponse] = useState(feedback.adminResponse || '');
    const [newStatus, setNewStatus] = useState(feedback.status);

    const handleStatusUpdate = () => {
        onStatusUpdate(feedback.id, newStatus, adminResponse);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Type</Label>
                    <p className={`font-medium ${feedback.type === 'COMPLAINT' ? 'text-red-600' : 'text-blue-600'}`}>
                        {feedback.type}
                    </p>
                </div>
                <div>
                    <Label>Priority</Label>
                    <p className="font-medium">{feedback.priority}</p>
                </div>
                <div>
                    <Label>Status</Label>
                    <p className="font-medium">{feedback.status}</p>
                </div>
                <div>
                    <Label>Submitted By</Label>
                    <p className="font-medium">{feedback.user.name}</p>
                </div>
            </div>

            <div>
                <Label>Title</Label>
                <p className="font-medium text-slate-900 dark:text-white">{feedback.title}</p>
            </div>

            <div>
                <Label>Content</Label>
                <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-3 rounded-md">
                    {feedback.content}
                </p>
            </div>

            <div>
                <Label>Submitted</Label>
                <p className="text-sm text-slate-500">
                    {new Date(feedback.createdAt).toLocaleString()}
                </p>
            </div>

            {feedback.adminResponse && (
                <div>
                    <Label>Admin Response</Label>
                    <p className="text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                        {feedback.adminResponse}
                    </p>
                </div>
            )}

            {isAdmin && (
                <div className="border-t pt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="newStatus">Update Status</Label>
                        <select
                            id="newStatus"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="adminResponse">Admin Response</Label>
                        <textarea
                            id="adminResponse"
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            placeholder="Provide response to user"
                            className="w-full p-2 border rounded-md h-24 resize-none"
                        />
                    </div>

                    <Button 
                        onClick={handleStatusUpdate}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        Update Feedback
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FeedbackSystem;