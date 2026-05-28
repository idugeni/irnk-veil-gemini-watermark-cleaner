/// <reference types="vite/client" />
/// <reference types="chrome" />

declare module '*?script&module' {
  const src: string;
  export default src;
}

interface Window {
  runWatermarkPipeline?: (
    imageData: ImageData
  ) => Promise<ImageData | { result: ImageData; stats?: Record<string, unknown> }>;
}

// Browser namespace for Firefox compatibility
declare const browser: typeof chrome;

// Extend chrome namespace for offscreen API and newer runtime methods
declare namespace chrome.runtime {
  interface Context {
    contextType: string;
    contextId: string;
    tabId: number;
    windowId: number;
    documentId: string;
    documentUrl: string;
    documentOrigin: string;
    incognito: boolean;
  }
  interface GetContextsOptions {
    contextTypes?: string[];
    documentUrls?: string[];
  }
  function getContexts(options: GetContextsOptions): Promise<Context[]>;
}

declare namespace chrome.offscreen {
  interface CreateDocumentOptions {
    url: string;
    reasons: string[];
    justification: string;
  }
  function createDocument(options: CreateDocumentOptions): Promise<void>;
  function closeDocument(): Promise<void>;
  enum Reason {
    AUDIO_PLAYBACK = 'AUDIO_PLAYBACK',
    BLOBS = 'BLOBS',
    CLIPBOARD = 'CLIPBOARD',
    DISPLAY_MEDIA = 'DISPLAY_MEDIA',
    DOM_PARSER = 'DOM_PARSER',
    DOM_SCRAPING = 'DOM_SCRAPING',
    IFRAME_SCRIPTING = 'IFRAME_SCRIPTING',
    MATCH_PATTERNS = 'MATCH_PATTERNS',
    TESTING = 'TESTING',
    USER_MEDIA = 'USER_MEDIA',
    WEB_RTC = 'WEB_RTC',
    WORKERS = 'WORKERS'
  }
}
