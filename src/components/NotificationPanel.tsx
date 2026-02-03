import { Bell, CheckCircle, Clock, Info, X } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning';
    read: boolean;
}

interface NotificationPanelProps {
    notifications?: Notification[];
    count?: number;
}

const defaultNotifications: Notification[] = [
    {
        id: 1,
        title: 'New Appointment Request',
        message: 'Rahul Kumar requested a consultation for tomorrow at 10:00 AM.',
        time: '2 mins ago',
        type: 'info',
        read: false,
    },
    {
        id: 2,
        title: 'Lab Report Ready',
        message: 'Blood work results for patient Sarah Jones are now available.',
        time: '1 hour ago',
        type: 'success',
        read: false,
    },
    {
        id: 3,
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight at 2:00 AM.',
        time: '5 hours ago',
        type: 'warning',
        read: true,
    },
    {
        id: 4,
        title: 'Low Stock Alert',
        message: 'Paracetamol stock is running low (below 100 units).',
        time: '1 day ago',
        type: 'warning',
        read: true,
    },
];

export function NotificationPanel({ notifications = defaultNotifications, count = 2 }: NotificationPanelProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Bell className="w-6 h-6 text-gray-600" />
                    {count > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {count}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl">Notifications</SheetTitle>
                        {count > 0 && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                {count} New
                            </Badge>
                        )}
                    </div>
                    <SheetDescription>
                        Stay updated with the latest alerts and activities.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-lg border ${notification.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'
                                } transition-colors hover:bg-gray-50`}
                        >
                            <div className="flex gap-3 items-start">
                                <div className={`mt-1 p-1.5 rounded-full ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                                        notification.type === 'warning' ? <Info className="w-4 h-4" /> :
                                            <Bell className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {notification.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {notifications.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No notifications yet</p>
                        </div>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <Button variant="outline" className="w-full text-gray-600">
                            Mark all as read
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
