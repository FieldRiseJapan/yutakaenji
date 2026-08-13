/** Quiet Current: an editable, SoftBank-inspired information strip for current announcements. */
import { ArrowUpRight } from "lucide-react";

type Announcement = {
  date: string;
  category: string;
  title: string;
  href: string;
};

type NewsStripProps = {
  items: readonly Announcement[];
};

export function NewsStrip({ items }: NewsStripProps) {
  return (
    <section className="top-news" aria-labelledby="news-title">
      <div className="top-news__heading">
        <span>INFORMATION</span>
        <h2 id="news-title">最新情報</h2>
      </div>
      <div className="top-news__items">
        {items.map((item) => (
          <a className="top-news__item" href={item.href} key={`${item.date}-${item.category}`}>
            <time>{item.date}</time>
            <span>{item.category}</span>
            <strong>{item.title}</strong>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
