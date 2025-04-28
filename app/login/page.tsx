'use client';

import React, { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { submitForm } from '@/actions/loginAction'; // Import the Server Action
import { useRouter } from 'next/navigation';

const Form = () => {
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

// LoginForm component
const LoginForm = () => {
  const [state, formAction] = useActionState(submitForm, null);
  const router = useRouter()
  useEffect(()=>{
    if(state?.status === 'success'){
      window.location.reload()
    }
  },[state,router])
  return (
    <form action={formAction} className="max-w-md mx-auto mt-10">
      <Form />
      {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
    </form>
  );
};

export default LoginForm;