import { useEffect, useRef, useState } from "react";
import { site } from "../content/site";

const nav = [
  ["#business", "事業内容"],
  ["#quality", "製造への姿勢"],
  ["#company", "会社案内"],
];
const Arrow = () => <span aria-hidden="true">↗</span>;
function Heading({
  n,
  en,
  title,
  id,
}: {
  n: string;
  en: string;
  title: string;
  id: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        <span>{n}</span> {en}
      </p>
      <h2 id={id}>{title}</h2>
    </div>
  );
}
export default function Home() {
  const [menu, setMenu] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu) {
        setMenu(false);
        toggle.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1000px)");
    const resize = () => {
      if (desktop.matches) setMenu(false);
    };
    document.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, [menu]);
  const jump = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMenu(false);
    const target = document.querySelector<HTMLElement>(
      event.currentTarget.hash
    );
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  };
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <header className="header">
        <a
          className="brand"
          href="#top"
          aria-label="株式会社ユタカエンジニアリング トップへ"
        >
          <span className="brand-word">
            YUTAKA<span className="brand-dot">.</span>
          </span>
          <span className="brand-jp">株式会社ユタカエンジニアリング</span>
        </a>
        <nav className="desktop-nav" aria-label="主要ナビゲーション">
          {nav.map(([href, label]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">
          ご相談・お問い合わせ <Arrow />
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={menu}
          aria-controls="mobile-menu"
          onClick={() => setMenu(!menu)}
          type="button"
        >
          {menu ? "閉じる" : "メニュー"}
          <span aria-hidden="true">{menu ? "×" : "☰"}</span>
        </button>
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="モバイルナビゲーション"
          hidden={!menu}
        >
          {[
            ...nav,
            ["#message", "代表メッセージ"],
            ["#history", "沿革"],
            ["#documents", "会社資料"],
            ["#contact", "お問い合わせ"],
          ].map(([href, label]) => (
            <a key={href} href={href} onClick={jump}>
              {label}
              <Arrow />
            </a>
          ))}
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="signal" /> YUTAKA ENGINEERING / KAGAWA
            </p>
            <p className="hero-category">
              高圧盤・配電盤・制御盤・ハーネス加工
            </p>
            <h1 id="hero-title">
              電気をつなぐ。
              <br />
              現場を<span className="underlined">支える。</span>
            </h1>
            <p className="hero-description">
              配電・制御のものづくりを、香川から。
              <br />
              設計・組立・改造、そしてハーネス加工。
              <br />
              一台ごとの要求に、まっすぐ向き合います。
            </p>
            <div className="hero-actions">
              <a className="button button--dark" href="#business">
                事業内容を見る <Arrow />
              </a>
              <a className="text-link" href="#contact">
                製作のご相談 <Arrow />
              </a>
            </div>
            <div className="hero-foot">
              <span>TAKAMATSU, KAGAWA</span>
              <a href="#business">SCROLL ↓</a>
            </div>
          </div>
          <div className="hero-art">
            <img
              src="assets/circuit.svg"
              width="720"
              height="760"
              alt=""
              fetchPriority="high"
            />
            <div className="art-top">
              <span>CONNECTING THE EVERYDAY</span>
              <span>01 — 03</span>
            </div>
            <div className="art-caption">
              <span className="art-caption-line" />
              <p>つなぐ。つくる。まもる。</p>
              <small>電気・制御のつながりを表すイメージ図</small>
            </div>
          </div>
        </section>
        <div className="service-index" aria-label="事業領域の一覧">
          {site.businesses.map(b => (
            <a key={b.number} href={`#service-${b.number}`}>
              <span>{b.number}</span>
              <strong>{b.title}</strong>
              <Arrow />
            </a>
          ))}
        </div>
        <section
          className="section business"
          id="business"
          aria-labelledby="business-title"
        >
          <div className="section-intro">
            <Heading
              n="01"
              en="OUR BUSINESS"
              title="一台ごとの要求に、確かな仕事を。"
              id="business-title"
            />
            <p>
              電気を届ける盤から、設備を動かす制御、
              <br className="desktop-break" />
              その内側をつなぐハーネスまで。
            </p>
          </div>
          <div className="business-grid">
            {site.businesses.map((b, i) => (
              <article
                className="business-card"
                id={`service-${b.number}`}
                key={b.number}
              >
                <div
                  className={`service-graphic service-graphic--${i}`}
                  aria-hidden="true"
                >
                  {[0, 1, 2, 3].map(n => (
                    <i key={n} />
                  ))}
                </div>
                <p className="card-kicker">
                  {b.number} /{" "}
                  {["POWER DISTRIBUTION", "CONTROL SYSTEMS", "WIRE HARNESS"][i]}
                </p>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
                <a className="card-link" href="#contact">
                  この事業について相談する <Arrow />
                </a>
              </article>
            ))}
          </div>
          <div className="business-note">
            <span>OTHER BUSINESS</span>
            <p>電気資材の販売も行っています。</p>
            <a href="#contact">
              お問い合わせ <Arrow />
            </a>
          </div>
        </section>
        <section
          className="quality section"
          id="quality"
          aria-labelledby="quality-title"
        >
          <div className="quality-intro">
            <Heading
              n="02"
              en="OUR APPROACH"
              title="図面の先にある、現場のために。"
              id="quality-title"
            />
            <p>
              求められる機能に対し、確実に、正確に。
              <br />
              工程の一つひとつに責任を持って製作します。
            </p>
            <a className="text-link" href="#contact">
              製作について相談する <Arrow />
            </a>
            <div className="quality-word" aria-hidden="true">
              PRECISION
              <br />
              <span>IN EVERY CONNECTION.</span>
            </div>
          </div>
          <ol className="process">
            {site.process.map(([n, title, body]) => (
              <li key={n}>
                <span>{n}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section
          className="section promise"
          id="promise"
          aria-labelledby="promise-title"
        >
          <Heading
            n="03"
            en="OUR PROMISE"
            title="つなぐ。つくる。まもる。"
            id="promise-title"
          />
          <div className="principles">
            {site.principles.map(p => (
              <article key={p.number}>
                <span>{p.number}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          className="section message"
          id="message"
          aria-labelledby="message-title"
        >
          <div>
            <p className="eyebrow">MESSAGE</p>
            <h2 id="message-title">
              ものづくりの先に、
              <br />
              人を育てる。
            </h2>
            <p className="message-quote">{site.message.quote}</p>
          </div>
          <div className="message-body">
            {site.message.paragraphs.map(p => (
              <p key={p}>{p}</p>
            ))}
            <p className="signature">
              <span>{site.message.role}</span>
              <strong>{site.message.name}</strong>
            </p>
          </div>
        </section>
        <section
          className="section company"
          id="company"
          aria-labelledby="company-title"
        >
          <div className="section-intro">
            <Heading
              n="04"
              en="COMPANY"
              title="香川・高松を拠点に。"
              id="company-title"
            />
            <p>
              技術を積み重ね、地域に根を張る。
              <br />
              株式会社ユタカエンジニアリング。
            </p>
          </div>
          <div className="company-grid">
            <div className="company-location">
              <p>YUTAKA ENGINEERING</p>
              <strong>
                TAKAMATSU
                <br />
                <span>KAGAWA.</span>
              </strong>
              <div className="location-rule" />
              <p>{site.address}</p>
              <a
                className="text-link"
                href="https://www.google.com/maps/search/?api=1&query=%E9%A6%99%E5%B7%9D%E7%9C%8C%E9%AB%98%E6%9D%BE%E5%B8%82%E5%9B%BD%E5%88%86%E5%AF%BA%E7%94%BA%E6%9F%8F%E5%8E%9F248-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google マップで見る
                <span className="sr-only">（新しいタブで開きます）</span>{" "}
                <Arrow />
              </a>
            </div>
            <dl className="profile">
              {site.profile.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div>
                <dt>電話番号</dt>
                <dd>
                  <a href={site.phoneHref}>{site.phone}</a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
        <section
          className="section history"
          id="history"
          aria-labelledby="history-title"
        >
          <Heading
            n="05"
            en="OUR HISTORY"
            title="積み重ねてきた歩み。"
            id="history-title"
          />
          <ol className="timeline">
            {site.timeline.map(([year, event]) => (
              <li key={year}>
                <time dateTime={year}>{year}</time>
                <p>{event}</p>
              </li>
            ))}
          </ol>
        </section>
        <section
          className="section documents"
          id="documents"
          aria-labelledby="documents-title"
        >
          <div className="section-intro">
            <Heading
              n="06"
              en="DOCUMENTS"
              title="会社と製作を知る資料。"
              id="documents-title"
            />
            <p>
              資料をご希望の方は、
              <br />
              お電話でお問い合わせください。
            </p>
          </div>
          <ul className="document-list">
            {site.resources.map((r, i) => (
              <li key={r.title}>
                <span className="document-number">0{i + 1}</span>
                <div>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                </div>
                <span className="document-tag">電話でお問い合わせ</span>
              </li>
            ))}
          </ul>
        </section>
        <section
          className="contact"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div>
            <p className="eyebrow">LET’S TALK / CONTACT</p>
            <h2 id="contact-title">
              まずは、現場のことを
              <br />
              お聞かせください。
            </h2>
            <p>配電盤・制御盤・ハーネス加工のご相談をお受けします。</p>
          </div>
          <div className="contact-action">
            <span>お電話でのご相談・お問い合わせ</span>
            <a href={site.phoneHref}>
              {site.phone}
              <Arrow />
            </a>
            <p>
              図面・用途・数量など、現在お分かりの内容を
              <br />
              お伝えいただくと、ご相談がスムーズです。
            </p>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-top">
          <a className="brand" href="#top">
            <span className="brand-word">
              YUTAKA<span className="brand-dot">.</span>
            </span>
            <span className="brand-jp">{site.companyName}</span>
          </a>
          <p>
            {site.address}
            <br />
            <a href={site.phoneHref}>TEL {site.phone}</a>
          </p>
          <a className="to-top" href="#top">
            ページ上部へ ↑
          </a>
        </div>
        <div className="footer-bottom">
          <small>© YUTAKA ENGINEERING</small>
          <span>つなぐ。つくる。まもる。</span>
        </div>
      </footer>
    </>
  );
}
