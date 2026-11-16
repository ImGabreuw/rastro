// Acervo integralmente fictício, transcrito do protótipo HTML original.
export type EvidenceType = "SLA" | "Ocorrência" | "Entrega" | "Prazo" | "Contrato";

export interface DemoDocument {
  id: string;
  title: string;
  kind: string;
  period: string;
  pages: number;
}

export interface EvidenceRecord {
  id: string;
  type: EvidenceType;
  date: string;
  title: string;
  summary: string;
  snippet: string;
  doc: string;
  place: string;
  page: number;
  keywords: string;
}

export const CONTRACT={supplier:'Atlas Serviços Digitais Ltda.',cnpj:'00.000.000/0001-00 (fictício)',process:'DEMO-2026-014',contract:'DEMO-031/2026',bidding:'Pregão eletrônico DEMO-014/2026',subject:'Suporte técnico e operação de serviços de TI',period:'Janeiro a setembro de 2026'};
export const DOCS: DemoDocument[] = [
{id:'DOC-01',title:'Relatório de fiscalização técnica · 1º trimestre',kind:'Fiscalização',period:'Janeiro a março de 2026',pages:12},
{id:'DOC-02',title:'Relatório de fiscalização técnica · 2º trimestre',kind:'Fiscalização',period:'Abril a junho de 2026',pages:14},
{id:'DOC-03',title:'Termo de recebimento de serviços',kind:'Recebimento',period:'Julho de 2026',pages:7},
{id:'DOC-04',title:'Relatório de acompanhamento contratual',kind:'Acompanhamento',period:'Agosto a setembro de 2026',pages:10}
];
export const RECORDS: EvidenceRecord[] = [
{id:'EV-009',type:'SLA',date:'2026-09-19',title:'Apuração mensal de disponibilidade do serviço',summary:'O relatório registra disponibilidade de 99,6% no período, conforme o indicador de disponibilidade definido no contrato.',snippet:'No período de referência, a disponibilidade apurada para o serviço foi de 99,6%, conforme a metodologia de aferição prevista no contrato.',doc:'DOC-04',place:'p. 8, seção 4.2',page:8,keywords:'disponibilidade indicador sla 99,6'},
{id:'EV-008',type:'Ocorrência',date:'2026-08-18',title:'Registro de interrupção pontual de atendimento',summary:'O acompanhamento contratual descreve interrupção temporária do canal de suporte no período indicado e o encaminhamento dado à ocorrência.',snippet:'Foi registrada interrupção temporária do canal de suporte em 18/08/2026, com encaminhamento da ocorrência à equipe responsável.',doc:'DOC-04',place:'p. 6, seção 3.1',page:6,keywords:'interrupção suporte ocorrência incidente'},
{id:'EV-007',type:'Entrega',date:'2026-07-25',title:'Recebimento de lote de serviços de suporte',summary:'O termo de recebimento identifica os serviços relacionados ao lote, a data de entrega e a etapa de recebimento documentada.',snippet:'O lote de serviços de suporte técnico foi recebido para conferência conforme os itens descritos no anexo deste termo.',doc:'DOC-03',place:'p. 3, item 2',page:3,keywords:'recebimento entrega lote'},
{id:'EV-006',type:'Prazo',date:'2026-06-26',title:'Acompanhamento de prazo de uma entrega prevista',summary:'O relatório do segundo trimestre registra a data inicialmente prevista e a data documentada para uma das entregas do contrato.',snippet:'A entrega referenciada no item 5 apresentou previsão para 20/06/2026 e registro de conclusão em 26/06/2026.',doc:'DOC-02',place:'p. 10, seção 5',page:10,keywords:'prazo cronograma entrega datas'},
{id:'EV-005',type:'SLA',date:'2026-06-08',title:'Medição de tempo de resposta do suporte',summary:'O relatório apresenta o tempo de resposta medido em uma amostra de solicitações e indica o critério contratual utilizado.',snippet:'A amostra de solicitações analisada apresentou tempo médio de primeira resposta de 37 minutos, calculado conforme o indicador contratual.',doc:'DOC-02',place:'p. 7, seção 4.1',page:7,keywords:'sla atendimento suporte tempo de resposta'},
{id:'EV-004',type:'Ocorrência',date:'2026-05-11',title:'Solicitação de esclarecimento sobre execução',summary:'O relatório registra solicitação de esclarecimento à contratada sobre uma atividade do escopo e a referência de acompanhamento.',snippet:'Em 11/05/2026 foi formalizada solicitação de esclarecimento sobre a execução da atividade descrita no item 3.2.',doc:'DOC-02',place:'p. 5, seção 3.2',page:5,keywords:'ocorrência esclarecimento execução'},
{id:'EV-003',type:'Entrega',date:'2026-03-28',title:'Registro de entregas periódicas de suporte',summary:'O documento do primeiro trimestre apresenta o conjunto de entregas realizadas e a data de registro de cada atividade.',snippet:'Foram relacionadas as entregas periódicas de suporte realizadas durante o trimestre, com seus respectivos registros de execução.',doc:'DOC-01',place:'p. 9, seção 5',page:9,keywords:'entrega serviço periódico'},
{id:'EV-002',type:'SLA',date:'2026-02-20',title:'Indicador de atendimento aos chamados',summary:'O relatório descreve a apuração mensal do indicador de atendimento dos chamados e o período observado.',snippet:'O indicador de atendimento aos chamados foi apurado para o mês de fevereiro, considerando os eventos documentados na base de acompanhamento.',doc:'DOC-01',place:'p. 6, seção 4',page:6,keywords:'sla chamados indicador'},
{id:'EV-001',type:'Contrato',date:'2026-01-15',title:'Identificação do objeto e período contratual',summary:'O relatório caracteriza o contrato, o período abrangido pela fiscalização e os serviços de TI sob acompanhamento.',snippet:'O objeto acompanhado compreende serviços de suporte técnico e operação de TI, conforme definido no instrumento contratual.',doc:'DOC-01',place:'p. 2, seção 1',page:2,keywords:'contrato objeto serviços'}
];

