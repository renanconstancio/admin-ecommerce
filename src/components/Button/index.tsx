import { DetailedHTMLProps, ReactNode } from 'react';
import 'style.scss';

type PropsButton = {
  variant:
    | 'btn-default'
    | 'btn-primary'
    | 'btn-success'
    | 'btn-warning'
    | 'btn-info'
    | 'btn-danger';
  children: ReactNode;
} & DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button({
  variant = 'btn-default',
  children,
  ...rest
}: PropsButton) {
  return (
    <button type="button" className={`btn ${variant}`} {...rest}>
      {children}
    </button>
  );
}
