import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

function Input({ className, ...props }: InputProps) {
    return (
        <input
            className={clsx(
                'border border-gray-300 rounded px-3 py-2 w-full outline-none',
                className
            )}
            {...props}
        />
    );
}

export default Input;
