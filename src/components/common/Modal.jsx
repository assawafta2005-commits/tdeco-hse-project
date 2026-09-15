import React from "react";
import { X } from "lucide-react";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" dir="rtl">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
