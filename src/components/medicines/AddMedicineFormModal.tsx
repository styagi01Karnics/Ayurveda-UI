import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import imgAdd from "../../assets/medicines/medicine-add-icon.svg";
import imgCalendar from "../../assets/medicines/medicine-calendar.svg";
import imgChevron from "../../assets/medicines/medicine-dropdown-chevron.svg";
import imgToggle from "../../assets/medicines/medicine-toggle.svg";

type FieldProps = {
  label: string;
  placeholder: string;
  icon?: "chevron" | "calendar";
};

function FormField({ label, placeholder, icon }: FieldProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <span className="text-[12px] font-medium leading-normal text-[#404040]">{label}</span>
      <div className="flex h-9 items-center rounded border border-[#d4d4d4] bg-white px-2.5 py-1.5">
        <span className="min-w-0 flex-1 text-[12px] font-normal text-[#737373]">{placeholder}</span>
        {icon === "chevron" ? (
          <img alt="" className="size-5 shrink-0" src={imgChevron} />
        ) : null}
        {icon === "calendar" ? (
          <img alt="" className="size-[18px] shrink-0" src={imgCalendar} />
        ) : null}
      </div>
    </div>
  );
}

function FormRow({ children }: { children: ReactNode }) {
  return <div className="flex gap-4">{children}</div>;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="text-[16px] font-medium leading-normal text-[#422c23]">{children}</p>
  );
}

export function AddMedicineFormModal() {
  return (
    <div
      className="pointer-events-auto absolute left-[410px] top-[110px] flex w-[700px] flex-col rounded-[12px] bg-white px-4 pb-8 pt-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
      data-node-id="1:10856"
    >
      <div className="mb-1">
        <p
          className="text-[16px] font-semibold leading-5 text-[#422c23]"
          data-node-id="1:10864"
        >
          Add Medicine
        </p>
        <p
          className="mt-1 text-[13px] font-medium leading-normal text-[#737373]"
          data-node-id="1:10863"
        >
          Please fill out the medicine details
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <SectionTitle>Medicine Information</SectionTitle>
        <FormRow>
          <FormField label="Medicine Name" placeholder="Medicine Name" icon="chevron" />
          <FormField label="Medicine Category" placeholder="Medicine Category" icon="chevron" />
        </FormRow>
        <FormRow>
          <FormField label="Manufacturer" placeholder="Manufacturer" icon="chevron" />
          <FormField label="Batch Number" placeholder="Batch Number" />
        </FormRow>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <SectionTitle>Medicine Information</SectionTitle>
        <FormRow>
          <FormField label="Quantity" placeholder="Quantity" icon="chevron" />
          <FormField label="Expiry Date" placeholder="Expiry Date" icon="calendar" />
        </FormRow>
        <FormRow>
          <FormField label="Purchase Price" placeholder="₹" />
          <FormField label="Selling Price" placeholder="₹" />
        </FormRow>
      </div>

      <div className="mt-8">
        <p className="text-[16px] font-medium leading-normal text-[#422c23]" data-node-id="1:10857">
          Low Stock Alert
        </p>
        <p
          className="mt-1 text-[13px] font-medium leading-normal text-[#737373]"
          data-node-id="1:10858"
        >
          Notify when stock below 20 units
        </p>
        <div className="mt-3 h-[23px] w-[50px]" data-node-id="1:10859">
          <img alt="" className="size-full" src={imgToggle} />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-end gap-3">
        <button
          type="button"
          className="flex h-9 w-[198px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#be880b] bg-white px-3"
          data-node-id="1:10875"
        >
          <img alt="" className="size-4 shrink-0" src={imgAdd} />
          <span
            className="text-[14px] font-semibold leading-6 text-[#be880b]"
            data-node-id="1:10876"
          >
            Add More Medicine
          </span>
        </button>
        <Link
          to="/medicines/add/confirm"
          className="flex h-9 w-[180px] cursor-pointer items-center justify-center rounded-lg bg-[#be880b] px-1.5 py-2"
          data-node-id="1:10862"
        >
          <span className="text-[16px] font-semibold leading-none tracking-[0.56px] text-white">
            Confirm
          </span>
        </Link>
      </div>
    </div>
  );
}
