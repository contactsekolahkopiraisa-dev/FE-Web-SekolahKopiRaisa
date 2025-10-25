interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export default function FormField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = ""
}: FormFieldProps) {
  const baseInputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent";
  const readOnlyClass = "bg-gray-100 text-gray-700";
  const inputClass = readOnly 
    ? `${baseInputClass} ${readOnlyClass}` 
    : baseInputClass;

  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${inputClass} ${className}`}
      />
    </div>
  );
}
