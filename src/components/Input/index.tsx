import { UseFormRegister } from 'react-hook-form';

type InputProps = {
  children?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  label: string;
  id: string;
  register: UseFormRegister<{ [x: string]: string }>;
  required?: boolean;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export function Input({
  id,
  label,
  type = 'text',
  required,
  register,
  children,
  ...rest
}: InputProps) {
  const { className } = rest;
  return (
    <div className={`form-input ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input type={type} {...register(label, { required })} {...rest} />
      {children}
    </div>
  );
}
