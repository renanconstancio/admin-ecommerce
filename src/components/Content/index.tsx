import './style.scss';

import { ReactChild, ReactChildren } from 'react';

interface ContentProps {
  children: ReactChild | ReactChildren;
}

export function Content({ children }: ContentProps) {
  return <section className="content">{children}</section>;
}
