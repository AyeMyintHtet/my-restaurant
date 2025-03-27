import settingAction from "@/actions/settingAction";
import ModalCom from "@/components/Modal";
import {
  menuCategoryTable,
  otherInfoTable,
  tierListTable,
} from "@/types/supabase_db.types";
import React, { useActionState } from "react";
import { useFormStatus } from "react-dom";

export interface FormField {
  inputid: string;
  name: string;
  value?: string;
}

export type ModalFormData = {
  table: string;
  data: FormField[];
  EditId?: number;
  callApi?: ()=> void;
};

type ISettingTableModel = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  renderField: ModalFormData;
};

const Form = ({ renderField }: { renderField: ModalFormData }) => {
  const isEdit = !!renderField.EditId;
  const { pending } = useFormStatus();
  return (
    <>
      {isEdit && <input type="hidden" name="id" value={renderField.EditId} />}
      {renderField.data.map((item, id) => (
        <div className="mb-4" key={id}>
          <label
            htmlFor={item.inputid}
            className="block text-sm font-medium text-gray-700"
          >
            {item.name}
          </label>
          <input
            type="text"
            id={item.inputid}
            name="table_no"
            defaultValue={item.value}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            autoComplete="off"
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={pending}
      >
        {pending ? "Submitting..." : isEdit ? "Update" : "Add"}
      </button>
    </>
  );
};

const SettingTableModel = ({
  open,
  setOpen,
  renderField,
}: ISettingTableModel) => {
  const isEdit = !!renderField.EditId;

  const ModalBody = () => {
    const action = isEdit ? settingAction.updateTable : settingAction.addTable;

    const [state, formAction] = useActionState(action, null);
    return (
      <form action={formAction}>
        <Form renderField={renderField} />
        <br />
        <br />
        {state?.error && (
          <div className="mb-4 text-red-600 border border-red-300 rounded p-2 bg-red-50">
            <p className="font-semibold">{state.error}</p>
            {state.hint && <p className="text-sm">{state.hint}</p>}
          </div>
        )}
      </form>
    );
  };

  return (
    <ModalCom
      open={open}
      setOpen={setOpen}
      title={`${isEdit ? "Edit" : "Add"} Data`}
      body={<ModalBody />}
    />
  );
};

export default SettingTableModel;
