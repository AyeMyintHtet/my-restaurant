'use client'
import buffetTableAction from '@/actions/tableAction';
import ModalCom from '@/components/Modal';
import { buffetTable } from '@/types/supabase_db.types';
import React, { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom';

interface IRestaurantTableModal {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  callApi: React.Dispatch<React.SetStateAction<boolean>>
  editData?: Partial<buffetTable> | null
}

const RestaurantTableModal = ({open,setOpen,callApi,editData}:IRestaurantTableModal) => {
  const isEdit = !!editData;
  const Form = ({ defaultValues }: { defaultValues: any }) => {
    const { pending } = useFormStatus();
    return (
      <>
        {isEdit && (
          <input type="hidden" name="id" value={defaultValues.id} />
        )}
  
        <div className="mb-4">
          <label htmlFor="table-number" className="block text-sm font-medium text-gray-700">
            Table Number
          </label>
          <input
            type="text"
            id="table-number"
            name="table_no"
            defaultValue={defaultValues.table_no}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            autoComplete="off"
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="max-customer" className="block text-sm font-medium text-gray-700">
            Max Customer
          </label>
          <input
            type="text"
            id="max-customer"
            name="max_customer"
            defaultValue={defaultValues.max_customer}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            autoComplete="off"
          />
        </div>
  
        <button
          type="submit"
          className="w-full cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={pending}
        >
          {pending ? 'Submitting...' : isEdit ? 'Update' : 'Add'}
        </button>
      </>
    );
  };

  const ModalBody =() => {
    const action = isEdit
      ?  buffetTableAction.updateBuffetTable
      :  buffetTableAction.addBuffetTable;
  
    const [state, formAction] = useActionState(action, null);
    useEffect(() => {
      if (state?.message === 'success') {
        setOpen(false);
        callApi((prev) => !prev);
      }
    }, [state]);
  
    return (
      <>
      <form action={formAction} className="max-w-md mx-auto mt-10">
        <Form
          defaultValues={
            editData || { id: '', table_no: '', max_customer: '' }
          }
        />
        <br />
        <br />
              {state?.error && (
        <div className="mb-4 text-red-600 border border-red-300 rounded p-2 bg-red-50">
          <p className="font-semibold">{state.error}</p>
          {state.hint && <p className="text-sm">{state.hint}</p>}
        </div>
      )}
      </form>
      </>

    );
  };

  return (
    <ModalCom open={open} setOpen={setOpen} title={`${isEdit ? 'Edit' : 'Add'} Table`} body={<ModalBody/>}/>
  )
}

export default RestaurantTableModal