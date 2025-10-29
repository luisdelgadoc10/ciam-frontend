import React from "react";

export default function DataItem({ label, value, icon }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-center gap-2 text-gray-900 font-medium">
        {icon && icon}
        <span>{value}</span>
      </div>
    </div>
  );
}
