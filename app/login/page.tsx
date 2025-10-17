'use client';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitForm } from '@/actions/loginAction'; // Ensure this is typed
import { useRouter } from 'next/navigation';
import HCaptcha from '@hcaptcha/react-hcaptcha';

// Define the expected shape of the state returned by submitForm
type FormState = {
  status?: 'success' | 'error';
  error?: string;
} | null;

const Form: React.FC = () => {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password" 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={pending}
      >
        {pending ? 'Submitting...' : 'Login'}
      </button>
    </>
  );
};

const LoginForm: React.FC = () => {
  const [state, formAction] = useActionState(submitForm, null);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>();
  const captcha = useRef<HCaptcha>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.status === 'success') {
      captcha.current?.resetCaptcha();
      window.location.reload(); // or router.refresh() in Next.js 13+
    }
  }, [state, router]);

  return (
    <>
      <form action={formAction} className="max-w-md mx-auto mt-10">
        <Form />
        <p className='text-gray-500 italic'>Email: admin@gmail.com , Password : admin123</p>
       {process.env.NODE_ENV === 'production' && <input type="hidden" name="captchaToken" value={captchaToken ?? ''} />}
        {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
      </form>
      {
        process.env.NODE_ENV === 'production' && (

          <HCaptcha
            ref={captcha}
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!}
            onVerify={(token: string) => {
              setCaptchaToken(token);
            }}
            />
        )
      }
    </>
  );
};

export default LoginForm;