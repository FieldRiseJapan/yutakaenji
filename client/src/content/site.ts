/** Quiet Current: verified public-facing copy is centralized here for clean content handoff. */
export const site = {
  companyName: "株式会社ユタカエンジニアリング",
  companyNameEn: "YUTAKA ENGINEERING",
  phone: "087-874-6556",
  phoneHref: "tel:0878746556",
  address: "〒769-0105 香川県高松市国分寺町柏原248番地1",
  navigation: [
    { label: "私たちの約束", href: "#promise" },
    { label: "代表メッセージ", href: "#message" },
    { label: "事業領域", href: "#business" },
    { label: "製造と品質", href: "#quality" },
    { label: "会社情報", href: "#company" },
  ],
  principles: [
    {
      number: "01",
      title: "つなぐ。",
      body: "日常を支える電気と、地域社会・お客さまとの信頼をつなぎます。",
    },
    {
      number: "02",
      title: "つくる。",
      body: "一台ごとの要求に向き合い、技術と人を育てながら、確かなものづくりを続けます。",
    },
    {
      number: "03",
      title: "まもる。",
      body: "品質と安全を積み重ね、安心して任せられる製造体制を守ります。",
    },
  ],
  businesses: [
    {
      number: "01",
      title: "高圧・受配電",
      body: "高圧盤、受電盤、配電盤の設計・組立・改造工事まで。電気を確実に届ける基盤を支えます。",
    },
    {
      number: "02",
      title: "制御・監視",
      body: "空調・動力・監視など、設備の安定した運転に必要な各種制御盤を製作します。",
    },
    {
      number: "03",
      title: "ケーブル・ハーネス",
      body: "図面と用途に合わせ、多品種少量のケーブル・ワイヤーハーネス加工に対応します。",
    },
  ],
  process: [
    ["01", "図面を読み解く", "要求事項を丁寧に確認し、製作の前提をそろえます。"],
    ["02", "手を動かし、組み上げる", "盤製作・配線・加工を、工程ごとの精度を保ちながら進めます。"],
    ["03", "確かめて、届ける", "一台に責任を持ち、次の現場で役立つ品質へつなげます。"],
  ],
  message: {
    quote: "物づくり＝人づくり。",
    paragraphs: [
      "少子高齢化、国際競争、価値観の多様化など、製造業を取り巻く環境は大きく変化しています。そのなかで私たちは、生産活動と日常生活に不可欠な配電盤・高圧盤を製造しています。",
      "電気とともに発展する社会と共生し、人々の暮らしに貢献すること。その理念を実現するために、私たちは「物づくり」と「人づくり」を同じものと考え、技術・技能と働く人の力を高め続けます。",
    ],
    title: "ものづくりの先に、人を育てる。",
    name: "久保宏之",
    role: "代表取締役",
  },
  profile: [
    ["社名", "株式会社ユタカエンジニアリング"],
    ["所在地", "〒769-0105 香川県高松市国分寺町柏原248番地1"],
    ["設立", "1984年7月1日"],
    ["代表者", "代表取締役 久保宏之"],
    ["資本金", "10,000,000円"],
    ["事業内容", "高圧盤・配電盤・制御盤の設計・組立・改造、ケーブル・ワイヤーハーネス製作、電気資材販売"],
  ],
  timeline: [
    ["1979", "ユタカ産商株式会社 機器事業部として発足"],
    ["1984", "株式会社ユタカエンジニアリングとして分離独立"],
    ["1987", "高松市国分寺町へ移転"],
    ["1990", "第二工場を新築"],
    ["2008", "第三工場を設立"],
    ["2011", "環境マネジメント KES-STEP2を取得"],
  ],
} as const;

export const assetUrls = {
  hero: "/manus-storage/yutaka-hero-control-panel_17482325.jpg",
  assembly: "/manus-storage/yutaka-workflow-assembly_96cfa980.jpg",
  inspection: "/manus-storage/yutaka-quality-inspection_4ccb63c1.jpg",
  detail: "/manus-storage/yutaka-facility-detail_4ac8ef5c.jpg",
  president: "/manus-storage/yutaka-president-kubo_fbd8e10e.jpg",
  mark: "/manus-storage/yutaka-circuit-mark_577a06d3.png",
} as const;
