'use client';
import { useEffect, useState } from 'react';
import { getMyNotifications, markAllRead, markNotificationRead, deleteNotification } from '@/services/notifications';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const res = await getMyNotifications();
    const itemsArray = Array.isArray(res.data) ? res.data : res.data?.notifications || [];
  setItems(itemsArray); //changed this line
  };

  useEffect(() => { load(); }, []);

  const markOne = async (id: string) => {
    await markNotificationRead(id);
    setItems(items.map(i => i._id === id ? { ...i, read: true } : i));
  };

  const del = async (id: string) => {
    await deleteNotification(id);
    setItems(items.filter(i => i._id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <Button onClick={async () => {
  try {
    await markAllRead();
    // update state locally so all notifications show as read instantly
    setItems(items.map(i => ({ ...i, read: true })));
  } catch (err) {
    console.error('Failed to mark all read', err);
  }
}}>Mark all as read</Button>
      </div>

      {items.length === 0 && <Card className="p-6">No notifications yet.</Card>}

      {items.map(n => (
        <Card key={n._id} className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">{n.message}</p>
            <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            {!n.read && <Button className="px-3 py-1 text-sm" onClick={()=>markOne(n._id)}>Mark read</Button>}
            <Button className="px-3 py-1 text-sm" onClick={()=>del(n._id)}>Delete</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
