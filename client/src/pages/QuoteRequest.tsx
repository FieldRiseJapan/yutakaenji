/** Quiet Current: a calm, stepwise harness quote draft that uses editable questions from the content module. */
import { ArrowLeft, ArrowRight, Check, FileUp, LoaderCircle, Paperclip, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { harnessQuoteConfig, type QuoteQuestion } from "../content/harnessQuote";
import { trpc } from "../lib/trpc";
import "../quote.css";

type FormValues = Record<string, string>;
type UploadPayload = { name: string; type: string; size: number; data: string };

function readFile(file: File): Promise<UploadPayload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"));
    reader.onload = () => {
      const result = String(reader.result || "");
      const data = result.includes(",") ? result.split(",")[1] || "" : result;
      resolve({ name: file.name, type: file.type || "application/octet-stream", size: file.size, data });
    };
    reader.readAsDataURL(file);
  });
}

export default function QuoteRequest() {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [files, setFiles] = useState<UploadPayload[]>([]);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState("");
  const submitQuote = trpc.quote.submit.useMutation();
  const step = harnessQuoteConfig.steps[stepIndex];
  const totalSteps = harnessQuoteConfig.steps.length;
  const totalFileSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  const setValue = (id: string, value: string) => {
    setValues((previous) => ({ ...previous, [id]: value }));
    setError("");
  };

  const validateCurrentStep = () => {
    const missing = step.questions.find((question) => question.required && !values[question.id]?.trim());
    if (missing) {
      setError(`「${missing.label}」を入力してください。`);
      return false;
    }
    return true;
  };

  const moveNext = () => {
    if (!validateCurrentStep()) return;
    setStepIndex((current) => Math.min(current + 1, totalSteps - 1));
  };

  const selectFiles = async (selected: FileList | null) => {
    if (!selected) return;
    const incoming = Array.from(selected);
    const nextCount = files.length + incoming.length;
    const nextBytes = totalFileSize + incoming.reduce((sum, file) => sum + file.size, 0);
    if (nextCount > harnessQuoteConfig.maxFiles || nextBytes > harnessQuoteConfig.maxTotalBytes) {
      setError(`添付は${harnessQuoteConfig.maxFiles}ファイル、合計10MBまでです。`);
      return;
    }
    const unsupported = incoming.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return !harnessQuoteConfig.acceptedFileTypes.includes(file.type as never) && !harnessQuoteConfig.allowedExtensions.includes(extension as never);
    });
    if (unsupported) {
      setError(`${unsupported.name} は対応していない形式です。PDF、図面、Excel、画像、ZIPをご利用ください。`);
      return;
    }
    try {
      const uploads = await Promise.all(incoming.map(readFile));
      setFiles((current) => [...current, ...uploads]);
      setError("");
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "ファイルを追加できませんでした。");
    }
  };

  const submit = () => {
    if (!validateCurrentStep()) return;
    if (!privacyAccepted) {
      setError(harnessQuoteConfig.privacy.consentRequiredMessage);
      return;
    }
    submitQuote.mutate(
      {
        requestType: values.requestType,
        shape: values.shape || undefined,
        quantity: values.quantity,
        delivery: values.delivery,
        wire: values.wire || undefined,
        priority: values.priority || undefined,
        materialFlexibility: values.materialFlexibility || undefined,
        requirements: values.requirements || undefined,
        note: values.note || undefined,
        companyName: values.companyName,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        privacyAccepted: true,
        files,
      },
      { onError: (mutationError) => setError(mutationError.message || "依頼を受け付けられませんでした。時間をおいて再度お試しください。") },
    );
  };

  if (submitQuote.data) {
    return (
      <main className="quote-page quote-page--complete">
        <section className="quote-complete" aria-live="polite">
          <span className="quote-complete__icon"><Check size={28} /></span>
          <p>{harnessQuoteConfig.label}</p>
          <h1>ご依頼を受け付けました。</h1>
          <strong>受付番号 #{submitQuote.data.requestId}</strong>
          <p>{harnessQuoteConfig.responseGuide}</p>
          {submitQuote.data.notificationStatus === "skipped" && <small>依頼内容は安全に保存されています。</small>}
          <Link href="/" className="quote-button quote-button--primary">サイトへ戻る <ArrowRight size={16} /></Link>
        </section>
      </main>
    );
  }

  const renderQuestion = (question: QuoteQuestion) => {
    if (question.type === "file") {
      return (
        <div className="quote-field quote-field--file" key={question.id}>
          <span className="quote-field__label">{question.label}</span>
          {question.hint && <p>{question.hint}</p>}
          <label className="quote-upload">
            <FileUp size={22} />
            <span>資料を選択する</span>
            <input type="file" multiple onChange={(event) => void selectFiles(event.target.files)} />
          </label>
          <small>{harnessQuoteConfig.attachmentGuide}</small>
          {files.length > 0 && <ul className="quote-files">{files.map((file) => <li key={`${file.name}-${file.size}`}><Paperclip size={14} />{file.name}<button type="button" onClick={() => setFiles((current) => current.filter((entry) => entry !== file))}>削除</button></li>)}</ul>}
        </div>
      );
    }

    if (question.type === "choice") {
      return (
        <fieldset className="quote-field" key={question.id}>
          <legend className="quote-field__label">{question.label}{question.required && <b>必須</b>}</legend>
          {question.hint && <p>{question.hint}</p>}
          <div className="quote-choice-grid">
            {question.choices?.map((choice) => (
              <label className={`quote-choice ${values[question.id] === choice.value ? "is-selected" : ""}`} key={choice.value}>
                <input type="radio" name={question.id} value={choice.value} checked={values[question.id] === choice.value} onChange={() => setValue(question.id, choice.value)} />
                <span>{choice.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    const common = {
      id: question.id,
      name: question.id,
      value: values[question.id] || "",
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(question.id, event.target.value),
      placeholder: question.hint,
    };

    return (
      <label className="quote-field" htmlFor={question.id} key={question.id}>
        <span className="quote-field__label">{question.label}{question.required && <b>必須</b>}</span>
        {question.type === "textarea" ? <textarea {...common} rows={4} /> : <input {...common} type={question.type} />}
      </label>
    );
  };

  return (
    <main className="quote-page">
      <header className="quote-header">
        <Link href="/" className="quote-back"><ArrowLeft size={16} />株式会社ユタカエンジニアリング</Link>
        <span>HARNESS / QUOTE</span>
      </header>
      <section className="quote-layout">
        <aside className="quote-intro">
          <p>{harnessQuoteConfig.label}</p>
          <h1>{harnessQuoteConfig.title}</h1>
          <p>{harnessQuoteConfig.lead}</p>
          <div className="quote-progress" aria-label={`全${totalSteps}ステップ中 ${stepIndex + 1}ステップ目`}>
            {harnessQuoteConfig.steps.map((entry, index) => <span className={index <= stepIndex ? "is-active" : ""} key={entry.id}>0{index + 1}</span>)}
          </div>
        </aside>
        <section className="quote-form-card">
          <div className="quote-form-card__head"><span>STEP 0{stepIndex + 1}</span><p>{step.description}</p></div>
          <h2>{step.title}</h2>
          <div className="quote-fields">{step.questions.map(renderQuestion)}</div>
          {stepIndex === totalSteps - 1 && (
            <div className="quote-consent">
              <div className="quote-consent__heading"><ShieldCheck size={18} /><strong>個人情報の取扱い</strong></div>
              <p>ご入力いただく連絡先・ご相談内容・添付資料は、お見積もり対応およびご連絡のために利用します。</p>
              <Link href="/privacy" target="_blank" className="quote-consent__link">{harnessQuoteConfig.privacy.linkLabel} <ArrowRight size={14} /></Link>
              <label className={`quote-consent__check ${privacyAccepted ? "is-checked" : ""}`}>
                <input type="checkbox" checked={privacyAccepted} onChange={(event) => { setPrivacyAccepted(event.target.checked); setError(""); }} />
                <span>{harnessQuoteConfig.privacy.consentLabel}<b>必須</b></span>
              </label>
            </div>
          )}
          {error && <p className="quote-error" role="alert">{error}</p>}
          <div className="quote-actions">
            {stepIndex > 0 ? <button className="quote-button quote-button--subtle" type="button" onClick={() => setStepIndex((current) => current - 1)}><ArrowLeft size={16} />戻る</button> : <span />}
            {stepIndex < totalSteps - 1 ? <button className="quote-button quote-button--primary" type="button" onClick={moveNext}>次へ <ArrowRight size={16} /></button> : <button className="quote-button quote-button--primary" type="button" disabled={submitQuote.isPending} onClick={submit}>{submitQuote.isPending ? <><LoaderCircle size={16} className="quote-spin" />送信中</> : <>依頼内容を送信する <ArrowRight size={16} /></>}</button>}
          </div>
        </section>
      </section>
    </main>
  );
}
