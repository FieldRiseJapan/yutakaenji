/** Quiet Current: a restrained internal review page for the owner to inspect harness quote requests. */
import { ArrowLeft, FileText, LockKeyhole, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { startLogin } from "../const";
import { useAuth } from "../_core/hooks/useAuth";
import { trpc } from "../lib/trpc";
import "../quote.css";

const statuses = ["new", "reviewing", "quoted", "closed"] as const;
const statusLabel = { new: "新規", reviewing: "確認中", quoted: "見積回答済", closed: "完了" } as const;

export default function QuoteReview() {
  const auth = useAuth();
  const quotes = trpc.quote.list.useQuery(undefined, { enabled: auth.user?.role === "admin" });
  const utils = trpc.useUtils();
  const updateStatus = trpc.quote.updateStatus.useMutation({ onSuccess: () => void utils.quote.list.invalidate() });

  if (auth.loading) return <main className="quote-page"><p className="quote-loading">確認しています…</p></main>;
  if (!auth.user) {
    return <main className="quote-page"><section className="quote-complete"><LockKeyhole size={28} /><h1>依頼管理</h1><p>担当者としてログインすると、見積もり依頼を確認できます。</p><button className="quote-button quote-button--primary" onClick={() => startLogin()}>ログインする</button></section></main>;
  }
  if (auth.user.role !== "admin") return <main className="quote-page"><section className="quote-complete"><LockKeyhole size={28} /><h1>閲覧権限がありません。</h1><p>依頼管理は管理者権限を持つ担当者のみ利用できます。</p><Link className="quote-button quote-button--subtle" href="/">サイトへ戻る</Link></section></main>;

  return (
    <main className="quote-page quote-review">
      <header className="quote-header"><Link href="/" className="quote-back"><ArrowLeft size={16} />サイトへ戻る</Link><span>ADMIN / QUOTES</span></header>
      <section className="quote-review__inner">
        <div className="quote-review__title"><div><p>HARNESS QUOTE INBOX</p><h1>見積もり依頼</h1></div><button className="quote-icon-button" onClick={() => void quotes.refetch()} aria-label="一覧を更新"><RefreshCw size={17} /></button></div>
        {quotes.isLoading && <p className="quote-loading">依頼を読み込んでいます…</p>}
        {quotes.error && <p className="quote-error">{quotes.error.message}</p>}
        {quotes.data?.length === 0 && <div className="quote-empty"><FileText size={28} /><p>まだ見積もり依頼はありません。</p></div>}
        <div className="quote-review-list">
          {quotes.data?.map((quote) => (
            <article className="quote-review-item" key={quote.id}>
              <div className="quote-review-item__top"><span>#{quote.id}</span><time>{new Date(quote.createdAt).toLocaleString("ja-JP")}</time><select value={quote.status} onChange={(event) => updateStatus.mutate({ id: quote.id, status: event.target.value as (typeof statuses)[number] })}>{statuses.map((status) => <option value={status} key={status}>{statusLabel[status]}</option>)}</select></div>
              <h2>{quote.companyName} <small>{quote.contactName} 様</small></h2>
              <p>{quote.requestType} / {quote.shape || "形状未定"} / {quote.quantity} / 希望納期: {quote.delivery}</p>
              <dl><div><dt>連絡先</dt><dd>{quote.email} / {quote.phone}</dd></div>{quote.wire && <div><dt>仕様</dt><dd>{quote.wire}</dd></div>}{quote.requirements && <div><dt>規格・用途</dt><dd>{quote.requirements}</dd></div>}</dl>
              {quote.attachments.length > 0 && <div className="quote-review-item__files">{quote.attachments.map((file) => <a href={file.fileUrl} key={file.id} target="_blank" rel="noreferrer"><PaperclipIcon />{file.originalName}</a>)}</div>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PaperclipIcon() { return <span aria-hidden="true">⌁</span>; }
