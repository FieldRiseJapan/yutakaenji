import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { privacyPolicy } from "../content/privacyPolicy";
import "../quote.css";

export default function PrivacyPolicy() {
  return (
    <main className="quote-page privacy-page">
      <header className="quote-header">
        <Link href="/" className="quote-back"><ArrowLeft size={16} />株式会社ユタカエンジニアリング</Link>
        <span>PRIVACY POLICY</span>
      </header>
      <article className="privacy-policy">
        <p className="privacy-policy__eyebrow"><ShieldCheck size={16} />PERSONAL INFORMATION</p>
        <h1>{privacyPolicy.title}</h1>
        <p className="privacy-policy__lead">{privacyPolicy.summary}</p>
        <p className="privacy-policy__updated">最終更新日：{privacyPolicy.updatedOn}</p>

        <section>
          <h2>事業者情報</h2>
          <p>{privacyPolicy.company.name}<br />{privacyPolicy.company.address}<br />{privacyPolicy.company.representative}</p>
        </section>

        {privacyPolicy.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
            {section.heading === "利用目的" && (
              <ul>{privacyPolicy.purposes.map((purpose) => <li key={purpose}>{purpose}</li>)}</ul>
            )}
          </section>
        ))}

        <section className="privacy-policy__contact">
          <h2>お問い合わせ窓口</h2>
          <p>{privacyPolicy.company.name}</p>
          <a href={privacyPolicy.company.phoneHref}>TEL {privacyPolicy.company.phone}</a>
        </section>
        <Link href="/harness-quote" className="quote-button quote-button--primary">見積もりフォームへ戻る</Link>
      </article>
    </main>
  );
}
