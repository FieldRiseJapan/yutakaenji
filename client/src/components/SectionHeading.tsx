/** Quiet Current: a reusable editorial chapter heading that keeps hierarchy consistent across sections. */
type SectionHeadingProps = {
  eyebrow: string;
  number: string;
  title: string;
  body?: string;
};

export function SectionHeading({ eyebrow, number, title, body }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div className="section-heading__meta">
        <span>{number}</span>
        <i />
        <span>{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}
