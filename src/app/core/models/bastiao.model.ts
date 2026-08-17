export interface ArtigoAnoCorrente {
  id: string;
  numero: number;
  mes: string;
  titulo: string;
  autoria: string;
  resumo: string;
  arquivo: string;
}

export interface CompendioHistorico {
  ano: number;
  lema: string;
  autoria: string;
  descricao: string;
  pdfUrl: string;
}

export interface BastiõesIndex {
  anoCorrente: number;
  lemaCorrente: number;
  artigosAnoCorrente: ArtigoAnoCorrente[];
  acervoHistorico: CompendioHistorico[];
}

export interface ConteudoArtigo {
  titulo: string;
  numero: string;
  autoria: string;
  data: string;
  paragrafos: string[];
}
