/** Quiet Current: SoftBank-inspired editorial sequencing, image-led chapters, and calm corporate wayfinding. */
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { assetUrls, site } from "../content/site";

function SectionHeading({
  eyebrow,
  number,
  title,
  body,
}: {
  eyebrow: string;
  number: string;
  title: string;
  body?: string;
}) {
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

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 42);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <div className="site-shell">
      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label={`${site.companyName} トップへ`}>
          <span className="brand__mark"><img src={assetUrls.mark} alt="" /></span>
          <span className="brand__copy">
            <strong>{site.companyName}</strong>
            <em>{site.companyNameEn}</em>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="主要ナビゲーション">
          {site.navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-contact" href="#contact">
          <span>お問い合わせ</span>
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      <div className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`} id="mobile-menu">
        <nav aria-label="モバイルナビゲーション">
          {site.navigation.map((item, index) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              <span>0{index + 1}</span>
              {item.label}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ))}
          <a href="#contact" onClick={closeMenu} className="mobile-menu__contact">
            お問い合わせ
          </a>
        </nav>
      </div>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <img className="hero__image" src={assetUrls.hero} alt="制御盤の製作に向き合う技術者" />
          <div className="hero__veil" />
          <div className="hero__content">
            <div className="hero__eyebrow">
              <span>EST. 1984</span>
              <i />
              <span>TAKAMATSU, KAGAWA</span>
            </div>
            <h1 id="hero-title">
              配電・制御の現場に、
              <br />
              <span>確かな一台を。</span>
            </h1>
            <p>
              高圧盤、配電盤、制御盤、ハーネス加工。
              <br />
              人と技術の力で、日常を支える電気をつくります。
            </p>
            <a className="button button--light" href="#business">
              事業領域を見る <ChevronRight size={17} aria-hidden="true" />
            </a>
          </div>
          <a className="hero__scroll" href="#promise" aria-label="私たちの約束へ移動">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={17} strokeWidth={1.5} aria-hidden="true" />
          </a>
          <aside className="hero-card" aria-label="企業理念">
            <p>OUR PROMISE</p>
            <strong>制御盤も、人をも、<br />つなぐ・つくる・まもる。</strong>
            <a href="#promise">
              私たちの約束 <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </aside>
        </section>

        <section className="top-news" aria-labelledby="news-title">
          <div className="top-news__heading">
            <span>INFORMATION</span>
            <h2 id="news-title">最新情報</h2>
          </div>
          <div className="top-news__items">
            {site.announcements.map((item) => (
              <a className="top-news__item" href={item.href} key={`${item.date}-${item.category}`}>
                <time>{item.date}</time>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="promise section" id="promise" aria-labelledby="promise-title">
          <span className="circuit-motif" aria-hidden="true"><i /><i /><i /></span>
          <div className="promise__intro">
            <SectionHeading
              number="01"
              eyebrow="OUR PROMISE"
              title="電気の先にある、毎日を支える。"
              body="私たちは、配電・制御のものづくりを通じて、地域社会とお客さまの現場に寄り添います。"
            />
          </div>
          <div className="principle-list" id="promise-title">
            {site.principles.map((principle) => (
              <article className="principle" key={principle.number}>
                <span className="principle__number">{principle.number}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
                <span className="principle__line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="leadership section section--leadership" id="message" aria-labelledby="message-title">
          <span className="circuit-motif" aria-hidden="true"><i /><i /><i /></span>
          <figure className="leadership__portrait">
            <img src={assetUrls.president} alt="株式会社ユタカエンジニアリング 代表取締役 久保宏之" loading="lazy" />
            <figcaption>
              <span>{site.message.role}</span>
              <strong>{site.message.name}</strong>
              <em>HIROYUKI KUBO</em>
            </figcaption>
          </figure>
          <div className="leadership__content">
            <SectionHeading
              number="03"
              eyebrow="MESSAGE"
              title={site.message.title}
            />
            <blockquote id="message-title">{site.message.quote}</blockquote>
            <div className="leadership__copy">
              {site.message.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <a className="leadership__company-link" href="#company">
              会社情報・沿革を見る <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="business section section--mist" id="business" aria-labelledby="business-title">
          <span className="circuit-motif" aria-hidden="true"><i /><i /><i /></span>
          <div className="business__top">
            <SectionHeading
              number="04"
              eyebrow="CAPABILITIES"
              title="一台ごとの要求に、まっすぐ応える。"
              body="設計・組立・改造から加工まで。用途と現場に合わせた、確かな製作を行います。"
            />
            <div className="business__visual">
              <img src={assetUrls.detail} alt="整然と施工された制御盤内部" loading="lazy" />
              <span>CONTROL / DISTRIBUTION / HARNESS</span>
            </div>
          </div>
          <div className="business-grid" id="business-title">
            {site.businesses.map((business) => (
              <article className="business-card" key={business.number}>
                <div className="business-card__head">
                  <span>{business.number}</span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </div>
                <h3>{business.title}</h3>
                <p>{business.body}</p>
                <span className="business-card__rule" />
              </article>
            ))}
          </div>
        </section>

        <section className="quality section" id="quality" aria-labelledby="quality-title">
          <span className="circuit-motif" aria-hidden="true"><i /><i /><i /></span>
          <div className="quality__media">
            <figure className="quality__image quality__image--main">
              <img src={assetUrls.assembly} alt="制御盤の配線を丁寧に組み上げる作業" loading="lazy" />
            </figure>
            <figure className="quality__image quality__image--accent">
              <img src={assetUrls.inspection} alt="完成した制御盤を確認する製造スタッフ" loading="lazy" />
            </figure>
            <span className="quality__stamp">MADE WITH<br />PRECISION</span>
          </div>
          <div className="quality__content">
            <SectionHeading
              number="05"
              eyebrow="MANUFACTURING & QUALITY"
              title="図面の先まで、品質をつなぐ。"
              body="求められる機能に対し、確実に、正確に。工程の一つひとつに責任を持って製作します。"
            />
            <ol className="process-list" id="quality-title">
              {site.process.map(([number, title, body]) => (
                <li key={number}>
                  <span>{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="history section section--history" id="history" aria-labelledby="history-title">
          <span className="history__watermark" aria-hidden="true">1979</span>
          <span className="circuit-motif" aria-hidden="true"><i /><i /><i /></span>
          <div className="history__intro">
            <SectionHeading
              number="06"
              eyebrow="OUR HISTORY"
              title="技術を受け継ぎ、次の現場へ。"
              body="高松の地で始まった歩みを、一台一台の製作とともに積み重ねてきました。"
            />
          </div>
          <div className="history__story" id="history-title">
            <div className="history__story-head">
              <span>1979 — TODAY</span>
              <p>株式会社ユタカエンジニアリングの歩み</p>
            </div>
            <ol className="history-timeline">
              {site.timeline.map(([year, event], index) => (
                <li className="history-timeline__item" key={`${year}-${event}`}>
                  <span className="history-timeline__index">0{index + 1}</span>
                  <time>{year}</time>
                  <p>{event}</p>
                </li>
              ))}
            </ol>
          </div>
          <a className="history__link" href="#company">
            会社情報を見る <ArrowDown size={16} aria-hidden="true" />
          </a>
        </section>

        <section className="company section section--paper" id="company" aria-labelledby="company-title">
          <span className="circuit-motif" aria-hidden="true"><i /><i /><i /></span>
          <div className="company__intro">
            <SectionHeading
              number="07"
              eyebrow="COMPANY"
              title="技術を積み重ね、地域に根を張る。"
              body="香川県高松市を拠点に、配電・制御の現場と向き合っています。"
            />
          </div>
          <div className="company__profile" id="company-title">
            {site.profile.map(([label, value]) => (
              <div className="profile-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </div>
          <a className="company__link" href="#contact">
              ご相談・お問い合わせ <ArrowUpRight size={18} aria-hidden="true" />
            </a>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="contact__index">08 / CONTACT</div>
          <div className="contact__body">
            <p>配電盤・制御盤・ハーネス加工のご相談をお受けします。</p>
            <h2 id="contact-title">まずは、現場のことを<br />お聞かせください。</h2>
          </div>
          <div className="contact__action">
            <span>お電話でのお問い合わせ</span>
            <a href={site.phoneHref}>
              <Phone size={20} strokeWidth={1.7} aria-hidden="true" />
              {site.phone}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <small>平日 8:00–17:00（営業時間はご確認ください）</small>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand brand--footer" href="#top">
          <span className="brand__mark"><img src={assetUrls.mark} alt="" /></span>
          <span className="brand__copy">
            <strong>{site.companyName}</strong>
            <em>{site.companyNameEn}</em>
          </span>
        </a>
        <p>{site.address}</p>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} YUTAKA ENGINEERING. All Rights Reserved.</span>
          <a href="#top">PAGE TOP <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </footer>
    </div>
  );
}
