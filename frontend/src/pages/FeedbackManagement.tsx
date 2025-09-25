import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Eye, CheckCircle, Clock, AlertTriangle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const FeedbackManagement: React.FC = () => {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    useEffect(() => {
        filterFeedbacks();
    }, [feedbacks, searchTerm, statusFilter, typeFilter]);

    const fetchFeedbacks = async () => {
        try {
            const response = await api.get('/feedbacks');
            setFeedbacks(response.data || []);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setFeedbacks([]);
        }
    };

    const filterFeedbacks = () => {
        let filtered = feedbacks;

        if (searchTerm) {
            filtered = filtered.filter(f => 
                f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(f => f.status === statusFilter);
        }

        if (typeFilter !== 'ALL') {
            filtered = filtered.filter(f => f.type === typeFilter);
        }

        setFilteredFeedbacks(filtered);
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'IN_PROGRESS':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'RESOLVED':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'CLOSED':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
        }
    };

    const getTypeColor = (type: string) => {
        return type === 'COMPLAINT' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'HIGH':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            default:
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
        }
    };

    const stats = [
        {
            title: 'Total Feedback',
            value: feedbacks.length.toString(),
            icon: MessageSquare,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Open Issues',
            value: feedbacks.filter(f => f.status === 'OPEN').length.toString(),
            icon: AlertTriangle,
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            title: 'In Progress',
            value: feedbacks.filter(f => f.status === 'IN_PROGRESS').length.toString(),
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        {
            title: 'Resolved',
            value: feedbacks.filter(f => f.status === 'RESOLVED').length.toString(),
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        }
    ];

    if (user?.role !== 'ADMINISTRATOR') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-8 text-center">
                        <MessageSquare className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600">Only administrators can access feedback management.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-navy-900 dark:text-white">Feedback & Complaints</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage staff feedback and resolve complaints</p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                                            <p className="text-2xl font-bold text-navy-900 dark:text-white">{stat.value}</p>
                                        </div>
                                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                            <Icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Search</Label>
                            <Input
                                placeholder="Search feedback..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="ALL">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="ALL">All Types</option>
                                <option value="FEEDBACK">Feedback</option>
                                <option value="COMPLAINT">Complaint</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('ALL');
                                    setTypeFilter('ALL');
                                }}
                                variant="outline"
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Feedback Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Feedback & Complaints ({filteredFeedbacks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFeedbacks.map((feedback, index) => (
                                <motion.tr
                                    key={feedback.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-gray-50 dark:hover:bg-navy-800"
                                >
                                    <TableCell className="font-medium">{feedback.title}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(feedback.type)}`}>
                                            {feedback.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(feedback.priority)}`}>
                                            {feedback.priority}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                                            {feedback.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{feedback.user.name}</TableCell>
                                    <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedFeedback(feedback);
                                                setShowDetailDialog(true);
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Feedback Details</DialogTitle>
                    </DialogHeader>
                    {selectedFeedback && (
                        <FeedbackDetail 
                            feedback={selectedFeedback} 
                            onStatusUpdate={updateFeedbackStatus}
                            isAdmin={true}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
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
                    <p className="font-medium">{feedback.user.name} ({feedback.user.role})</p>
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

            {feedback.resolvedAt && (
                <div>
                    <Label>Resolved</Label>
                    <p className="text-sm text-slate-500">
                        {new Date(feedback.resolvedAt).toLocaleString()}
                    </p>
                </div>
            )}

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

export default FeedbackManagement;