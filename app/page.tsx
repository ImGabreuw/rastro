"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { CONTRACT, DOCS, RECORDS } from "./data";
import type { DemoDocument, EvidenceRecord, EvidenceType } from "./data";

type Route = "home" | "results" | "detail" | "coverage" | "about";
type RouteState = { route: Route; recordId: string };
type Nav = (route: Route, recordId?: string) => void;
type OpenViewer = (docId: string, page: number, recordId?: string) => void;
type ViewerState = { docId: string; page: number; recordId?: string };
type IconName = "brand" | "search" | "arrow" | "left" | "file" | "calendar" | "info" | "copy" | "shield" | "folder";

const PAGE_SIZE = 4;
const RECORD_TYPES = ["Todos os tipos", "SLA", "Ocorrência", "Entrega", "Prazo", "Contrato"] as const;
type RecordFilter = (typeof RECORD_TYPES)[number];

const ICONS: Record<IconName, ReactNode> = {
  brand: <><path d="M4 16l6-6 4 3 6-7" /><path d="M16 6h4v4" /><path d="M4 21h16" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></>,
  arrow: <path d="m5 12 14 0m-6-6 6 6-6 6" />,
  left: <path d="m14 6-6 6 6 6" />,
  file: <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM13 2v7h7M8 14h8M8 18h6" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  shield: <><path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  folder: <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10l2 2h6.5A2.5 2.5 0 0 1 21 8.5v10A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5z" />,
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.85" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

const docById = (id: string) => DOCS.find((doc) => doc.id === id);
const recordById = (id: string) => RECORDS.find((record) => record.id === id);
const formatDate = (date: string) => date.split("-").reverse().join("/");
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function routeFromHash(): RouteState {
  const hash = decodeURIComponent(window.location.hash);
  if (hash.startsWith("#evidencia/")) {
    const id = hash.slice("#evidencia/".length);
    return { route: "detail", recordId: recordById(id) ? id : RECORDS[0].id };
  }
  if (hash === "#resultados") return { route: "results", recordId: RECORDS[0].id };
  if (hash === "#coverage") return { route: "coverage", recordId: RECORDS[0].id };
  if (hash === "#about") return { route: "about", recordId: RECORDS[0].id };
  return { route: "home", recordId: RECORDS[0].id };
}

function TypePill({ type }: { type: EvidenceType }) {
  const cssClass = type === "Ocorrência" ? "occ" : type === "Entrega" ? "ent" : type === "Prazo" ? "pra" : "";
  return <span className={`type ${cssClass}`}>{type}</span>;
}

function Breadcrumb({ current, navigate }: { current: string; navigate: Nav }) {
  return (
    <div className="topline">
      <button type="button" onClick={() => navigate("home")}>Início</button> / <b>{current}</b>
    </div>
  );
}

function SearchForm({ isHome, input, onInputChange, onSearch }: {
  isHome: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className={`search-shell ${isHome ? "" : "results-search"}`} onSubmit={onSearch}
      role="search" aria-label="Buscar contratos e fornecedores">
      <Icon name="search" size={21} />
      <input type="search" aria-label="Fornecedor, CNPJ ou contrato"
        placeholder="Busque fornecedor, CNPJ, processo ou contrato"
        autoComplete="off" value={input} onChange={(event) => onInputChange(event.target.value)} />
      <button className="primary" type="submit"><Icon name="search" size={17} /> Buscar</button>
    </form>
  );
}

function HomeView({ input, onInputChange, onSearch, onExample, navigate }: {
  input: string;
  onInputChange: (value: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  onExample: (value: string) => void;
  navigate: Nav;
}) {
  return (
    <div className="wrap home">
      <p className="eyebrow">Consulta documental · Contratações públicas de TI</p>
      <h1>Encontre o histórico público<br /><span>por trás de cada fornecedor.</span></h1>
      <p className="home-lead">Pesquise contratos anteriores, consulte registros publicados e confira a evidência na fonte. Um ponto de partida para análises após a publicação do edital.</p>
      <SearchForm isHome input={input} onInputChange={onInputChange} onSearch={onSearch} />
      <div className="quick">
        <span className="quick-label">Experimente:</span>
        <button className="chip" type="button" onClick={() => onExample("Atlas Serviços Digitais")}>Atlas Serviços Digitais</button>
        <button className="chip" type="button" onClick={() => onExample("DEMO-031/2026")}>DEMO-031/2026</button>
        <button className="chip" type="button" onClick={() => onExample("")}>Explorar todo o acervo</button>
      </div>
      <section className="home-context" aria-label="Edital ilustrativo">
        <div className="home-context-head">
          <span className="context-sign"><Icon name="file" size={23} /></span>
          <div>
            <p className="overline">Contexto de uso · Edital demonstrativo</p>
            <strong>Contratação de serviços de suporte e operação de TI</strong>
            <p>Consulta a evidências públicas de contratos anteriores para subsidiar a análise de fornecedores.</p>
          </div>
        </div>
        <button className="text-button" type="button" onClick={() => navigate("coverage")}>Ver cobertura <Icon name="arrow" size={15} /></button>
      </section>
      <p className="subnote">Acervo piloto: 1 contrato, 4 documentos simulados e 9 registros fictícios. A ausência de registros não indica ausência de ocorrências.</p>
    </div>
  );
}

function ResultCard({ record, navigate }: { record: EvidenceRecord; navigate: Nav }) {
  const document = docById(record.doc);
  if (!document) return null;

  return (
    <article className="result-card">
      <div className="record-head"><TypePill type={record.type} /><span className="record-id">{record.id} · Exemplo fictício</span></div>
      <h2>{record.title}</h2>
      <p>{record.summary}</p>
      <div className="record-meta">
        <span><Icon name="folder" /> {CONTRACT.supplier}</span>
        <span><Icon name="file" /> {CONTRACT.contract}</span>
        <span><Icon name="calendar" /> {formatDate(record.date)}</span>
      </div>
      <div className="result-footer">
        <span className="source-inline"><Icon name="file" /> {document.title} · {record.place}</span>
        <button className="link-button" type="button" onClick={() => navigate("detail", record.id)}>Ver evidência <Icon name="arrow" size={16} /></button>
      </div>
    </article>
  );
}

function ResultsView({ query, input, onInputChange, onSearch, type, onTypeChange, sort, onSortChange, page, onPageChange, results, navigate }: {
  query: string;
  input: string;
  onInputChange: (value: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  type: RecordFilter;
  onTypeChange: (value: RecordFilter) => void;
  sort: "new" | "old";
  onSortChange: (value: "new" | "old") => void;
  page: number;
  onPageChange: (page: number) => void;
  results: EvidenceRecord[];
  navigate: Nav;
}) {
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="wrap inner">
      <Breadcrumb current="Resultados" navigate={navigate} />
      <h1 className="page-title">Evidências encontradas</h1>
      <p className="page-intro">Registros de contratos anteriores vinculados ao fornecedor e à fonte documental. Use os filtros para localizar informações relevantes ao edital em análise.</p>
      <SearchForm isHome={false} input={input} onInputChange={onInputChange} onSearch={onSearch} />
      <div className="results-shell">
        <aside className="filter-pane" aria-label="Filtros de registros">
          <h2 className="filter-title">Refinar resultados</h2>
          <div className="filter-group">
            <p className="filter-label">Tipo de registro</p>
            {RECORD_TYPES.map((item) => (
              <label className="filter-option" key={item}>
                <input type="radio" name="recordType" value={item} checked={type === item}
                  onChange={() => onTypeChange(item)} />{item}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <p className="filter-label">Ordenação</p>
            <select className="select" aria-label="Ordenar registros" value={sort}
              onChange={(event) => onSortChange(event.target.value as "new" | "old")}>
              <option value="new">Mais recentes</option>
              <option value="old">Mais antigos</option>
            </select>
          </div>
          <p className="filter-foot">A consulta abrange apenas o acervo documentado neste piloto.</p>
        </aside>
        <div>
          <div className="result-toolbar">
            <div>
              <strong>{results.length} {results.length === 1 ? "registro encontrado" : "registros encontrados"}</strong>
              <small>{query ? `Pesquisa: “${query}”` : "Todos os registros do acervo demonstrativo"}</small>
            </div>
            <span className="pill">1 contrato no piloto</span>
          </div>
          {results.length > 0 ? (
            <>
              <div className="result-stack">{visible.map((record) => <ResultCard key={record.id} record={record} navigate={navigate} />)}</div>
              <div className="paging">
                <span>Exibindo {(currentPage - 1) * PAGE_SIZE + 1} a {Math.min(currentPage * PAGE_SIZE, results.length)} de {results.length}</span>
                <div className="page-btns">
                  <button className="page-btn" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
                  {Array.from({ length: pages }, (_, index) => (
                    <button key={index} aria-label={`Página ${index + 1}`}
                      aria-current={currentPage === index + 1 ? "page" : undefined}
                      className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                      onClick={() => onPageChange(index + 1)}>{index + 1}</button>
                  ))}
                  <button className="page-btn" aria-label="Próxima página" disabled={currentPage === pages} onClick={() => onPageChange(currentPage + 1)}>›</button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty">
              <div className="circle"><Icon name="search" size={26} /></div>
              <h2>Nenhum registro localizado neste acervo</h2>
              <p>Tente outro fornecedor, processo ou contrato. A ausência de resultados indica apenas que esta base limitada não contém registros correspondentes e não permite concluir que não houve ocorrências.</p>
              <button className="outline" onClick={() => navigate("coverage")}>Consultar cobertura documental <Icon name="arrow" size={15} /></button>
            </div>
          )}
          <div className="aside-card">
            <Icon name="shield" size={20} />
            <div>
              <strong>Dados para apoiar a análise, sem julgamento automático.</strong>
              <p>Os registros mostram o contexto informado na fonte. A decisão sobre habilitação ou contratação deve seguir o edital e a legislação aplicável. Todos os dados desta demonstração são fictícios.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyValue({ label, children }: { label: string; children: ReactNode }) {
  return <div className="kv"><small>{label}</small><strong>{children}</strong></div>;
}

function DetailView({ record, navigate, onOpenViewer }: {
  record: EvidenceRecord;
  navigate: Nav;
  onOpenViewer: OpenViewer;
}) {
  const sourceDoc = docById(record.doc);
  if (!sourceDoc) return null;

  async function copyReference() {
    const reference = `[EXEMPLO FICTÍCIO] ${record.title}. ${CONTRACT.supplier}. Contrato ${CONTRACT.contract}. ${sourceDoc.title}, ${record.place}.`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API indisponível");
      await navigator.clipboard.writeText(reference);
      window.alert("Referência fictícia copiada.");
    } catch {
      const field = window.document.createElement("textarea");
      field.value = reference;
      window.document.body.appendChild(field);
      field.select();
      let copied = false;
      try {
        copied = window.document.execCommand("copy");
      } finally {
        field.remove();
      }
      window.alert(copied ? "Referência fictícia copiada." : reference);
    }
  }

  return (
    <div className="wrap inner">
      <button className="back" onClick={() => navigate("results")}><Icon name="left" size={16} /> Voltar aos resultados</button>
      <div className="detail-top">
        <div>
          <TypePill type={record.type} />
          <h1>{record.title}</h1>
          <p>Registro {record.id} · {formatDate(record.date)} · Demonstração fictícia</p>
        </div>
        <button className="outline" onClick={copyReference}><Icon name="copy" size={16} /> Copiar referência</button>
      </div>
      <div className="detail-grid">
        <section className="panel">
          <h2>Resumo da evidência</h2>
          <p className="summary">{record.summary}</p>
          <h2>Contexto do contrato anterior</h2>
          <div className="kv-grid">
            <KeyValue label="Fornecedor">{CONTRACT.supplier}</KeyValue>
            <KeyValue label="Identificador do contrato">{CONTRACT.contract}</KeyValue>
            <KeyValue label="Processo">{CONTRACT.process}</KeyValue>
            <KeyValue label="Tipo de registro">{record.type}</KeyValue>
            <KeyValue label="Data do registro">{formatDate(record.date)}</KeyValue>
            <KeyValue label="Objeto contratual">{CONTRACT.subject}</KeyValue>
          </div>
          <div className="aside-card" style={{ marginTop: 29 }}>
            <Icon name="info" size={20} />
            <div>
              <strong>Interpretação contextual</strong>
              <p>O registro descreve uma informação documental e não representa nota, avaliação de desempenho ou recomendação sobre a empresa.</p>
            </div>
          </div>
        </section>
        <section className="panel">
          <h2>Fonte da evidência</h2>
          <div className="source-card">
            <span className="source-icon"><Icon name="file" size={22} /></span>
            <div><strong>{sourceDoc.title}</strong><small>Documento simulado · {sourceDoc.period}</small></div>
          </div>
          <div className="kv-grid">
            <KeyValue label="Localização exata">{record.place}</KeyValue>
            <KeyValue label="Código do documento">{sourceDoc.id}</KeyValue>
            <KeyValue label="Contrato relacionado">{CONTRACT.contract}</KeyValue>
            <KeyValue label="Tipo de documento">{sourceDoc.kind}</KeyValue>
          </div>
          <div className="source-actions">
            <button className="primary" onClick={() => onOpenViewer(sourceDoc.id, record.page, record.id)}>
              <Icon name="file" size={17} /> Conferir trecho da fonte
            </button>
          </div>
          <p className="fineprint">Esta prévia ilustra a conferência. O link oficial será disponibilizado quando o parceiro validar os documentos públicos do piloto.</p>
        </section>
      </div>
    </div>
  );
}

function CoverageView({ navigate, onOpenViewer }: { navigate: Nav; onOpenViewer: OpenViewer }) {
  return (
    <div className="wrap inner">
      <Breadcrumb current="Cobertura documental" navigate={navigate} />
      <h1 className="page-title">Cobertura documental</h1>
      <p className="page-intro">Conheça os documentos que podem aparecer nos resultados. A cobertura explícita evita que uma busca sem retorno seja confundida com ausência de histórico.</p>
      <div className="note"><Icon name="info" size={20} /><div><strong>Base inteiramente fictícia.</strong> O piloto real ainda precisa selecionar e verificar uma licitação de TI e os documentos públicos correspondentes. Nenhuma evidência desta demonstração é oficial.</div></div>
      <div className="panel" style={{ marginTop: 20 }}>
        <h2>Recorte do exemplo</h2>
        <div className="kv-grid">
          <KeyValue label="Fornecedor">{CONTRACT.supplier}</KeyValue>
          <KeyValue label="Contrato anterior">{CONTRACT.contract}</KeyValue>
          <KeyValue label="Processo">{CONTRACT.process}</KeyValue>
          <KeyValue label="Objeto">{CONTRACT.subject}</KeyValue>
          <KeyValue label="Documentos simulados">{DOCS.length}</KeyValue>
          <KeyValue label="Registros cadastrados">{RECORDS.length}</KeyValue>
        </div>
      </div>
      <h2 style={{ fontSize: 18, margin: "32px 0 13px" }}>Documentos incluídos</h2>
      <div className="simple-list">
        {DOCS.map((doc) => (
          <div className="doc-row" key={doc.id}>
            <span className="doc-icon"><Icon name="file" size={20} /></span>
            <div>
              <div className="doc-title">{doc.title}</div>
              <div className="doc-meta">{doc.kind} · {doc.period} · {doc.pages} páginas simuladas</div>
            </div>
            <button className="outline" onClick={() => onOpenViewer(doc.id, 1)}>Ver prévia <Icon name="arrow" size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutView({ navigate }: { navigate: Nav }) {
  return (
    <div className="wrap inner">
      <Breadcrumb current="Sobre" navigate={navigate} />
      <h1 className="page-title">Da busca à evidência, sem etapas extras.</h1>
      <p className="page-intro">O MVP foi desenhado para o analista consultar informações de contratos públicos anteriores durante a análise de fornecedores, mantendo o documento original como referência.</p>
      <div className="about-grid">
        <div className="about-item"><span className="num">01 / PESQUISAR</span><h3>Encontre o contrato</h3><p>Informe o fornecedor ou número do processo ou contrato. Refine por tipo de registro.</p></div>
        <div className="about-item"><span className="num">02 / ANALISAR</span><h3>Leia com contexto</h3><p>Confira o fornecedor, o período e o resumo, sem pontuações ou classificações automáticas.</p></div>
        <div className="about-item"><span className="num">03 / CONFERIR</span><h3>Valide na fonte</h3><p>Acesse a página ou seção informada para conferir a informação em seu contexto original.</p></div>
      </div>
      <div className="note" style={{ marginTop: 25 }}><Icon name="shield" size={19} /><div><strong>Limites do MVP.</strong> Não há IA, extração automática, ranking de fornecedores, uso de documentos internos ou monitoramento em tempo real. O protótipo é totalmente simulado.</div></div>
      <button className="primary" style={{ marginTop: 25 }} onClick={() => navigate("home")}><Icon name="search" size={17} /> Começar a pesquisar</button>
    </div>
  );
}

function ViewerModal({ viewer, doc, onClose, onMovePage }: {
  viewer: ViewerState;
  doc: DemoDocument;
  onClose: () => void;
  onMovePage: (delta: number) => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const preferred = viewer.recordId ? recordById(viewer.recordId) : undefined;
  const matched = preferred?.page === viewer.page ? preferred : RECORDS.find((item) => item.doc === doc.id && item.page === viewer.page);

  return (
    <div className="modal-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="viewer-title" className="modal">
        <div className="modal-header">
          <div><strong id="viewer-title">{doc.title}</strong><small>Prévia fictícia · página {viewer.page} de {doc.pages}</small></div>
          <button className="close" aria-label="Fechar documento" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <div className="paper">
            <div className="watermark">DOCUMENTO DEMONSTRATIVO · SEM VALOR OFICIAL</div>
            <h2>{doc.title}</h2>
            <p><strong>Fornecedor:</strong> {CONTRACT.supplier}<br />
              <strong>Contrato:</strong> {CONTRACT.contract}<br />
              <strong>Referência:</strong> página {viewer.page}{matched ? `, ${matched.place}` : ""}</p>
            <p>Esta página é uma representação fictícia da conferência de documentos públicos.</p>
            {matched ? <p><mark>{matched.snippet}</mark></p> : <p>Nenhuma evidência foi cadastrada nesta página simulada.</p>}
            <p className="paper-foot">Página {viewer.page}/{doc.pages} · Protótipo para validação, não é documento oficial.</p>
          </div>
        </div>
        <div className="modal-bottom">
          <div className="pages">
            <button className="page-btn" aria-label="Página anterior" disabled={viewer.page === 1} onClick={() => onMovePage(-1)}>‹</button>
            <small>Página {viewer.page} de {doc.pages}</small>
            <button className="page-btn" aria-label="Próxima página" disabled={viewer.page === doc.pages} onClick={() => onMovePage(1)}>›</button>
          </div>
          <small>Trecho destacado apenas para demonstração</small>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [view, setView] = useState<RouteState>({ route: "home", recordId: RECORDS[0].id });
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<RecordFilter>("Todos os tipos");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [page, setPage] = useState(1);
  const [viewer, setViewer] = useState<ViewerState | null>(null);

  useEffect(() => {
    function syncFromLocation() { setView(routeFromHash()); }
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    window.addEventListener("hashchange", syncFromLocation);
    return () => {
      window.removeEventListener("popstate", syncFromLocation);
      window.removeEventListener("hashchange", syncFromLocation);
    };
  }, []);

  function navigate(route: Route, recordId?: string) {
    const nextId = recordId ?? view.recordId;
    const hash = route === "home" ? "#buscar" : route === "detail" ? `#evidencia/${nextId}` : route === "results" ? "#resultados" : `#${route}`;
    window.history.pushState(null, "", hash);
    setView({ route, recordId: nextId });
    setViewer(null);
    window.scrollTo(0, 0);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(input.trim());
    setPage(1);
    navigate("results");
  }

  function applyExample(value: string) {
    setInput(value);
    setQuery(value);
    setType("Todos os tipos");
    setPage(1);
    navigate("results");
  }

  function changePage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openViewer(docId: string, page: number, recordId?: string) {
    if (!docById(docId)) return;
    setViewer({ docId, page, recordId });
  }

  const results = useMemo(() => {
    const terms = normalize([CONTRACT.supplier, CONTRACT.cnpj, CONTRACT.contract, CONTRACT.process, CONTRACT.bidding].join(" "));
    const needle = normalize(query);
    return RECORDS.filter((record) => (!needle || terms.includes(needle)) && (type === "Todos os tipos" || record.type === type))
      .sort((a, b) => sort === "new" ? b.date.localeCompare(a.date) || a.id.localeCompare(b.id) : a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  }, [query, type, sort]);

  const activeRecord = recordById(view.recordId) ?? RECORDS[0];
  const activeDoc = viewer ? docById(viewer.docId) : undefined;
  const activeNav = view.route === "coverage" ? "coverage" : view.route === "about" ? "about" : "home";

  return (
    <>
      <header className="site-header">
        <button className="brand" onClick={() => navigate("home")} aria-label="Rastro, início">
          <span className="brand-mark"><Icon name="brand" size={23} /></span>
          <span><span className="brand-name">rastro<span>.</span></span><span className="brand-sub">evidências públicas</span></span>
        </button>
        <div className="header-end">
          <nav className="nav" aria-label="Menu principal">
            <button className={activeNav === "home" ? "active" : ""} onClick={() => navigate("home")}>Buscar</button>
            <button className={activeNav === "coverage" ? "active" : ""} onClick={() => navigate("coverage")}>Cobertura</button>
            <button className={activeNav === "about" ? "active" : ""} onClick={() => navigate("about")}>Sobre</button>
          </nav>
          <span className="demo">DADOS FICTÍCIOS</span>
        </div>
      </header>
      <main>
        {view.route === "home" && <HomeView input={input} onInputChange={setInput} onSearch={submitSearch} onExample={applyExample} navigate={navigate} />}
        {view.route === "results" && (
          <ResultsView query={query} input={input} onInputChange={setInput} onSearch={submitSearch}
            type={type} onTypeChange={(value) => { setType(value); setPage(1); }}
            sort={sort} onSortChange={(value) => { setSort(value); setPage(1); }}
            page={page} onPageChange={changePage} results={results} navigate={navigate} />
        )}
        {view.route === "detail" && <DetailView record={activeRecord} navigate={navigate} onOpenViewer={openViewer} />}
        {view.route === "coverage" && <CoverageView navigate={navigate} onOpenViewer={openViewer} />}
        {view.route === "about" && <AboutView navigate={navigate} />}
      </main>
      <footer className="footer"><span>Rastro · Protótipo do MVP</span> · Dados e documentos fictícios, sem valor oficial. A consulta não substitui as regras do edital nem a análise administrativa e jurídica.</footer>
      {viewer && activeDoc && <ViewerModal viewer={viewer} doc={activeDoc} onClose={() => setViewer(null)}
        onMovePage={(delta) => setViewer((previous) => previous ? { ...previous, page: Math.max(1, Math.min(activeDoc.pages, previous.page + delta)) } : null)} />}
    </>
  );
}
