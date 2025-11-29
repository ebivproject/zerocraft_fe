declare module "mammoth" {
  interface ConvertResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  interface ConvertOptions {
    arrayBuffer?: ArrayBuffer;
    path?: string;
    buffer?: Buffer;
  }

  export function convertToHtml(options: ConvertOptions): Promise<ConvertResult>;
  export function extractRawText(options: ConvertOptions): Promise<ConvertResult>;
}
