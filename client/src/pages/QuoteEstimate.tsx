import { ArrowLeft, FileText, Plus, Printer, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { useAuth } from "../_core/hooks/useAuth";
import { quoteEstimateConfig, formatYen } from "../content/quoteEstimate";
import { trpc } from "../lib/trpc";
import "../quote.css";

type DraftItem = { description: string; specification: string; quantity: number; unit: string; unitPrice: number };
type DraftEstimate = { estimateNumber: string; issueDate: string; validUntil: string; taxRate: number; deliveryTerms: string; paymentTerms: string; notes: string; items: DraftItem[] };

const japaneseDate = () => new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

export default function QuoteEstimate() {
  const [, params] = useRoute("/admin/quotes/:quoteId/estimate");
  const quoteId = Number(params?.quoteId);
  const auth = useAuth();
  const utils = trpc.useUtils();
  const quote = trpc.quote.getById.useQuery({ id: quoteId }, { enabled: auth.user?.role === "admin" && Number.isInteger(quoteId) && quoteId > 0 });
  const savedEstimate = trpc.quote.getEstimate.useQuery({ quoteRequestId: quoteId }, { enabled: auth.user?.role === "admin" && Number.isInteger(quoteId) && quoteId > 0 });
  const [draft, setDraft] = useState<DraftEstimate | null>(null);
  const saveEstimate = trpc.quote.saveEstimate.useMutation({
    onSuccess: (result) => {
      setDraft((current) => current ? { ...current, estimateNumber: result.estimateNumber } : current);
      void savedEstimate.refetch();
      void utils.quote.getEstimate.invalidate({ quoteRequestId: quoteId });
    },
  });

  useEffect(() => {
    if (!quote.data || !savedEstimate.isFetched) return;
    if (savedEstimate.data) {
      setDraft({
        estimateNumber: savedEstimate.data.estimateNumber,
        issueDate: savedEstimate.data.issueDate,
        validUntil: savedEstimate.data.validUntil,
        taxRate: savedEstimate.data.taxRate,
        deliveryTerms: savedEstimate.data.deliveryTerms ?? "",
        paymentTerms: savedEstimate.data.paymentTerms ?? "",
        notes: savedEstimate.data.notes ?? "",
        items: savedEstimate.data.items.map((item) => ({ description: item.description, specification: item.specification ?? "", quantity: item.quantity, unit: item.unit, unitPrice: item.unitPrice })),
      });
      return;
    }
    setDraft({
      estimateNumber: "",
      issueDate: japaneseDate(),
      validUntil: quoteEstimateConfig.defaults.validUntil,
      taxRate: quoteEstimateConfig.defaults.taxRate,
      deliveryTerms: quoteEstimateConfig.defaults.deliveryTerms,
      paymentTerms: quoteEstimateConfig.defaults.paymentTerms,
      notes: quoteEstimateConfig.defaults.notes,
      items: [{ description: `ハーネス加工（${quote.data.requestType}）`, specification: [quote.data.wire, quote.data.requirements].filter(Boolean).join(" / "), quantity: 1, unit: "式", unitPrice: 0 }],
    });
  }, [quote.data, savedEstimate.data, savedEstimate.isFetched]);

  const totals = useMemo(() => {
    const subtotal = (draft?.items ?? []).reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = Math.floor(subtotal * (draft?.taxRate ?? 0) / 100);
    return { subtotal, tax, total: subtotal + tax };
  }, [draft]);

  const updateDraft = (key: Exclude<keyof DraftEstimate, "items">, value: string | number) => setDraft((current) => current ? { ...current, [key]: value } : current);
  const updateItem = (index: number, key: keyof DraftItem, value: string | number) => setDraft((current) => current ? { ...current, items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) } : current);
  const save = () => {
    if (!draft) return;
    saveEstimate.mutate({ quoteRequestId: quoteId, ...draft, estimateNumber: draft.estimateNumber || undefined });
  };

  if (auth.loading || quote.isLoading || savedEstimate.isLoading || !draft) return <main className="quote-page"><p className="quote-loading">見積書を準備しています…</p></main>;
  if (!auth.user || auth.user.role !== "admin" || !quote.data) return <main className="quote-page"><section className="quote-complete"><FileText size={28} /><h1>見積書を開けません。</h1><p>管理者としてログインし、依頼管理から見積書を開いてください。</p><Link className="quote-button quote-button--subtle" href="/admin/quotes">依頼管理へ戻る</Link></section></main>;

  return <main className="quote-page quote-estimate-page">
    <header className="quote-header estimate-no-print"><Link href="/admin/quotes" className="quote-back"><ArrowLeft size={16} />依頼管理へ戻る</Link><span>ADMIN / ESTIMATE DRAFT</span></header>
    <section className="estimate-shell">
      <aside className="estimate-editor estimate-no-print">
        <p>QUOTE DRAFT EDITOR</p><h1>見積書を作成</h1><small>依頼 #{quote.data.id} / {quote.data.companyName}</small>
        <div className="estimate-editor__actions"><button className="quote-button quote-button--subtle" type="button" onClick={save} disabled={saveEstimate.isPending}><Save size={15} />{saveEstimate.isPending ? "保存中…" : quoteEstimateConfig.labels.save}</button><button className="quote-button quote-button--primary" type="button" onClick={() => window.print()}><Printer size={15} />{quoteEstimateConfig.labels.print}</button></div>
        {saveEstimate.error && <p className="quote-error">{saveEstimate.error.message}</p>}
        {saveEstimate.isSuccess && <p className="estimate-save-note">下書きを保存しました。</p>}
        <fieldset className="estimate-fields"><label>見積番号<input value={draft.estimateNumber || quoteEstimateConfig.number.pending} readOnly aria-label="見積番号" /></label><small className="estimate-number-help">初回保存時に「{quoteEstimateConfig.number.prefix}-年月-連番」の形式で自動採番します。</small><label>発行日<input value={draft.issueDate} onChange={(event) => updateDraft("issueDate", event.target.value)} /></label><label>有効期限<input value={draft.validUntil} onChange={(event) => updateDraft("validUntil", event.target.value)} /></label><label>消費税率（%）<input type="number" min="0" max="100" value={draft.taxRate} onChange={(event) => updateDraft("taxRate", Number(event.target.value) || 0)} /></label><label>納入条件<textarea rows={2} value={draft.deliveryTerms} onChange={(event) => updateDraft("deliveryTerms", event.target.value)} /></label><label>支払条件<textarea rows={2} value={draft.paymentTerms} onChange={(event) => updateDraft("paymentTerms", event.target.value)} /></label><label>備考<textarea rows={4} value={draft.notes} onChange={(event) => updateDraft("notes", event.target.value)} /></label></fieldset>
        <h2>明細</h2>{draft.items.map((item, index) => <div className="estimate-item-editor" key={index}><div><label>品目<input value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} /></label><label>仕様<textarea rows={2} value={item.specification} onChange={(event) => updateItem(index, "specification", event.target.value)} /></label></div><div className="estimate-item-editor__numbers"><label>数量<input type="number" min="1" value={item.quantity} onChange={(event) => updateItem(index, "quantity", Math.max(1, Number(event.target.value) || 1))} /></label><label>単位<input value={item.unit} onChange={(event) => updateItem(index, "unit", event.target.value)} /></label><label>単価（円）<input type="number" min="0" value={item.unitPrice} onChange={(event) => updateItem(index, "unitPrice", Math.max(0, Number(event.target.value) || 0))} /></label></div>{draft.items.length > 1 && <button className="estimate-line-remove" type="button" onClick={() => setDraft((current) => current ? { ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) } : current)}><Trash2 size={14} />明細を削除</button>}</div>)}<button className="estimate-add-line" type="button" onClick={() => setDraft((current) => current ? { ...current, items: [...current.items, { description: "追加明細", specification: "", quantity: 1, unit: "式", unitPrice: 0 }] } : current)}><Plus size={15} />{quoteEstimateConfig.labels.addItem}</button>
      </aside>
      <article className="estimate-document" aria-label="見積書プレビュー">
        <div className="estimate-document__watermark">DRAFT</div><header><div><p>{quoteEstimateConfig.labels.draft}</p><h1>御 見 積 書</h1></div><dl><div><dt>見積番号</dt><dd>{draft.estimateNumber || "保存時に自動採番"}</dd></div><div><dt>発行日</dt><dd>{draft.issueDate}</dd></div></dl></header>
        <section className="estimate-document__recipient"><p>{quote.data.companyName}</p><strong>{quote.data.contactName} 様</strong><span>下記の通りお見積もり申し上げます。</span></section>
        <section className="estimate-document__issuer"><strong>{quoteEstimateConfig.issuer.name}</strong><span>{quoteEstimateConfig.issuer.address}</span><span>TEL {quoteEstimateConfig.issuer.phone}</span></section>
        <section className="estimate-document__total"><span>見積金額（税込）</span><strong>{formatYen(totals.total)}</strong></section>
        <table><thead><tr><th>品目</th><th>仕様</th><th>数量</th><th>単位</th><th>単価</th><th>金額</th></tr></thead><tbody>{draft.items.map((item, index) => <tr key={index}><td>{item.description}</td><td>{item.specification || "―"}</td><td>{item.quantity}</td><td>{item.unit}</td><td>{formatYen(item.unitPrice)}</td><td>{formatYen(item.quantity * item.unitPrice)}</td></tr>)}</tbody><tfoot><tr><th colSpan={5}>小計</th><td>{formatYen(totals.subtotal)}</td></tr><tr><th colSpan={5}>消費税（{draft.taxRate}%）</th><td>{formatYen(totals.tax)}</td></tr><tr><th colSpan={5}>合計</th><td>{formatYen(totals.total)}</td></tr></tfoot></table>
        <dl className="estimate-document__terms"><div><dt>有効期限</dt><dd>{draft.validUntil}</dd></div><div><dt>納入条件</dt><dd>{draft.deliveryTerms || "―"}</dd></div><div><dt>支払条件</dt><dd>{draft.paymentTerms || "―"}</dd></div><div><dt>備考</dt><dd>{draft.notes || "―"}</dd></div></dl>
        <footer>株式会社ユタカエンジニアリング　見積書下書き</footer>
      </article>
    </section>
  </main>;
}
