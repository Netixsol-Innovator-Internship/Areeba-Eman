
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/lib/validators';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const { register: registerUser } = useAuth(); // renamed to avoid naming conflict
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (v: any) => {
    await registerUser(v.username, v.email, v.password); // call AuthContext.register
    router.push('/login');
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input placeholder="Username" {...register('username')} />
          {errors.username && <p className="text-sm text-pink-600">{String(errors.username.message)}</p>}
          <Input placeholder="Email" {...register('email')} />
          {errors.email && <p className="text-sm text-pink-600">{String(errors.email.message)}</p>}
          <Input placeholder="Password" type="password" {...register('password')} />
          {errors.password && <p className="text-sm text-pink-600">{String(errors.password.message)}</p>}
          <Button disabled={isSubmitting}>{isSubmitting ? 'Signing up...' : 'Signup'}</Button>
        </form>
      </Card>
    </div>
  );
}


// export default function SignupPage() {
//   const { signup } = useAuth();
//   const router = useRouter();
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(signupSchema) });

//   const onSubmit = async (v: any) => {
//     await signup(v.username, v.email, v.password);
//     router.push('/');
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <Card className="p-6 space-y-4">
//         <h2 className="text-xl font-semibold">Create account</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//           <Input placeholder="Username" {...register('username')} />
//           {errors.username && <p className="text-sm text-pink-600">{String(errors.username.message)}</p>}
//           <Input placeholder="Email" {...register('email')} />
//           {errors.email && <p className="text-sm text-pink-600">{String(errors.email.message)}</p>}
//           <Input placeholder="Password" type="password" {...register('password')} />
//           {errors.password && <p className="text-sm text-pink-600">{String(errors.password.message)}</p>}
//           <Button disabled={isSubmitting}>{isSubmitting ? 'Signing up...' : 'Signup'}</Button>
//         </form>
//       </Card>
//     </div>
//   );
// }
