declare module 'pdf-parse' {
  interface PDFInfo {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }

  interface PDFData {
    text: string;
    info: PDFInfo;
    metadata: any;
  }

  function pdfParse(buffer: Buffer): Promise<PDFData>;
  export default pdfParse;
}
