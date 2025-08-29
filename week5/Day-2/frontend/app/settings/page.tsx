'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { uploadProfilePicture } from '@/services/users';

export default function SettingsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const onUpload = async () => {
    if (!file) return;
    await uploadProfilePicture(file);
    setMsg('Uploaded!');
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="p-6 space-y-3">
        <h2 className="text-xl font-semibold">Profile</h2>
        <input type="file" accept="image/*" onChange={(e)=> setFile(e.target.files?.[0]||null)} />
        <Button onClick={onUpload}>Upload</Button>
        {msg && <p className="text-green-600">{msg}</p>}
      </Card>
    </div>
  );
}
