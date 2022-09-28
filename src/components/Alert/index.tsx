import './style.scss';
import { ReactNode, useState } from 'react';

type TAlert = {
  children: ReactNode;
  variant?: true;
  severity?: string | 'success' | 'info' | 'danger' | 'warning';
  onClose?: boolean;
};

export function Alert({ severity, onClose, children }: TAlert) {
  const [close, setClose] = useState(true);
  return (
    <>
      {close && (
        <div className={`alert ${severity}`}>
          <span>{children}</span>
          {onClose && <i onClick={() => setClose(!close)}>x</i>}
        </div>
      )}
    </>
  );
}
