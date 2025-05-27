import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

function Button({ className, ...props }: ButtonProps) {
    return (
        <button
            type="button"
            className={clsx(
                'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer',
                className
            )}
            {...props}
        />
    );
}

export default Button;
