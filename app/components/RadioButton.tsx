import React from "react";

interface RadioButtonProps {
    name: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
    name,
    options,
    value,
    onChange,
}) => (
    <div className="flex flex-col gap-2">
        {options.map((option) => (
            <label className="inline-flex items-center" key={option.value}>
                <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={onChange}
                    className="mr-2 accent-amber-950"
                />
                {option.label}
            </label>
        ))}
    </div>
);

export default RadioButton;
