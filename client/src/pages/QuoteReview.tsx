/** Quiet Current: a restrained internal review page for the owner to inspect harness quote requests. */
import { ArrowLeft, Download, FileText, Info, LockKeyhole, Plus, RefreshCw, Search, StickyNote, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { startLogin } from "../const";
import { useAuth } from "../_core/hooks/useAuth";
import { quoteManagementConfig, quoteStatusLabels, quoteStatusValues } from "../content/quoteManagement";
import { buildQuoteCsv } from "../lib/quoteCsv";
import { trpc } from "../lib/trpc";
import "../quote.css";

const statuses = quoteStatusValues;

export default function QuoteReview() {
  const auth = useAuth();
  const quotes = trpc.quote.list.useQuery(undefined, { enabled: auth.user?.role === "admin" });
  const utils = trpc.useUtils();
  const updateStatus = trpc.quote.updateStatus.useMutation({ onSuccess: () => void utils.quote.list.invalidate() });
  const updateAdminNote = trpc.quote.updateAdminNote.useMutation({ onSuccess: () => void utils.quote.list.invalidate() });
  const createSample = trpc.quote.createSample.useMutation({ onSuccess: () => void utils.quote.list.invalidate() });
  const deleteSample = trpc.quote.deleteSample.useMutation({ onSuccess: () => void utils.quote.list.invalidate() });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | (typeof statuses)[number]>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [draftNotes, setDraftNotes] = useState<Record<number, string>>({});

  const filteredQuotes = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase();
    return (quotes.data ?? []).filter((quote) => {
      const quoteDate = new Date(quote.createdAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
      const matchesKeyword = !keyword || [quote.companyName, quote.contactName, quote.email, quote.phone, quote.quantity, quote.requestType, quote.adminNote ?? ""].join(" ").toLocaleLowerCase().includes(keyword);
      const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
      const matchesFrom = !dateFrom || quoteDate >= dateFrom;
      const matchesTo = !dateTo || quoteDate <= dateTo;
      return matchesKeyword && matchesStatus && matchesFrom && matchesTo;
    });
  }, [dateFrom, dateTo, quotes.data, search, statusFilter]);

  const exportCsv = () => {
    const csv = buildQuoteCsv(filteredQuotes);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${quoteManagementConfig.csv.filePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
        <div className="quote-review-tools">
          <label className="quote-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={quoteManagementConfig.labels.searchPlaceholder} aria-label={quoteManagementConfig.labels.searchAriaLabel} /></label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | (typeof statuses)[number])} aria-label="受付状況で絞り込み"><option value="all">{quoteManagementConfig.labels.allStatuses}</option>{statuses.map((status) => <option value={status} key={status}>{quoteStatusLabels[status]}</option>)}</select>
          <label className="quote-date"><span>{quoteManagementConfig.labels.receivedDate}</span><input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label>
          <span className="quote-date__divider">〜</span>
          <label className="quote-date"><span className="quote-sr-only">終了日</span><input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label>
          <button className="quote-button quote-button--subtle" type="button" onClick={() => { setSearch(""); setStatusFilter("all"); setDateFrom(""); setDateTo(""); }}>{quoteManagementConfig.labels.clearFilters}</button>
          <button className="quote-button quote-button--primary" type="button" onClick={exportCsv} disabled={filteredQuotes.length === 0}><Download size={15} />{quoteManagementConfig.labels.exportCsv}</button>
        </div>
        {!quotes.isLoading && <p className="quote-review-count">{filteredQuotes.length}{quoteManagementConfig.labels.resultCountSuffix}</p>}
        {quotes.isLoading && <p className="quote-loading">依頼を読み込んでいます…</p>}
        {quotes.error && <p className="quote-error">{quotes.error.message}</p>}
        {quotes.data?.length === 0 && <section className="quote-empty quote-empty--guided"><FileText size={28} /><h2>まだ見積もり依頼はありません。</h2><p>依頼が届くと、会社名・担当者名・メール・担当者メモから検索し、受付状況と受付日で絞り込みできます。</p><div className="quote-empty__steps"><span>1. 確認用依頼を作成</span><span>2. 検索・メモ・CSVを試す</span><span>3. 確認用依頼を削除</span></div><button className="quote-button quote-button--primary" type="button" disabled={createSample.isPending} onClick={() => createSample.mutate()}><Plus size={15} />{createSample.isPending ? "作成中…" : "確認用依頼を作成"}</button><p className="quote-empty__notice"><Info size={14} />確認用依頼は管理者のみ作成でき、メール通知は送信されません。</p></section>}
        {quotes.data && quotes.data.length > 0 && filteredQuotes.length === 0 && <div className="quote-empty"><Search size={28} /><p>{quoteManagementConfig.labels.noResults}</p></div>}
        <div className="quote-review-list">
          {filteredQuotes.map((quote) => (
            <article className="quote-review-item" key={quote.id}>
              <div className="quote-review-item__top"><span>#{quote.id}</span><time>{new Date(quote.createdAt).toLocaleString("ja-JP")}</time><select value={quote.status} onChange={(event) => updateStatus.mutate({ id: quote.id, status: event.target.value as (typeof statuses)[number] })}>{statuses.map((status) => <option value={status} key={status}>{quoteStatusLabels[status]}</option>)}</select></div>
              <h2>{quote.companyName} {quote.isSample && <span className="quote-sample-badge">確認用データ</span>} <small>{quote.contactName} 様</small></h2>
              <p>{quote.requestType} / {quote.shape || "形状未定"} / {quote.quantity} / 希望納期: {quote.delivery}</p>
              <dl><div><dt>連絡先</dt><dd>{quote.email} / {quote.phone}</dd></div>{quote.wire && <div><dt>仕様</dt><dd>{quote.wire}</dd></div>}{quote.requirements && <div><dt>規格・用途</dt><dd>{quote.requirements}</dd></div>}</dl>
              <div className="quote-review-item__note"><div><StickyNote size={15} /><strong>{quoteManagementConfig.memo.title}</strong></div><textarea value={draftNotes[quote.id] ?? quote.adminNote ?? ""} onChange={(event) => setDraftNotes((current) => ({ ...current, [quote.id]: event.target.value }))} placeholder={quoteManagementConfig.memo.placeholder} rows={3} /><button className="quote-button quote-button--subtle" type="button" disabled={updateAdminNote.isPending} onClick={() => updateAdminNote.mutate({ id: quote.id, adminNote: draftNotes[quote.id] ?? quote.adminNote ?? "" })}>{updateAdminNote.isPending ? quoteManagementConfig.memo.saving : quoteManagementConfig.memo.save}</button></div>
              {quote.isSample && <button className="quote-sample-delete" type="button" disabled={deleteSample.isPending} onClick={() => deleteSample.mutate({ id: quote.id })}><Trash2 size={14} />{deleteSample.isPending ? "削除中…" : "確認用依頼を削除"}</button>}
              {quote.attachments.length > 0 && <div className="quote-review-item__files">{quote.attachments.map((file) => <a href={file.fileUrl} key={file.id} target="_blank" rel="noreferrer"><PaperclipIcon />{file.originalName}</a>)}</div>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PaperclipIcon() { return <span aria-hidden="true">⌁</span>; }
