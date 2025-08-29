'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '@/lib/validators';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { createComment } from '@/services/comments';
import { useState } from 'react';

export default function Composer({
  parentId,
  onCreated,
}: {
  parentId?: string;
  onCreated?: (c: any) => void;
}) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(commentSchema),
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: any) => {
    setError(null);
    try {
      const res = await createComment({ content: values.content, parentId });
      reset();
      onCreated?.(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to post');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Textarea
        placeholder={parentId ? 'Write a reply...' : 'Share something...'}
        {...register('content')}
      />
      {errors.content && (
        <p className="text-sm text-pink-600">{String(errors.content.message)}</p>
      )}
      {error && <p className="text-sm text-pink-600">{error}</p>}
      <Button disabled={isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post'}
      </Button>
    </form>
  );
}
