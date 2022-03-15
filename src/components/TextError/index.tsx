import './style.scss';

export function TextError({ text }: { text: string }) {
  return <code>{text}</code>;
}
