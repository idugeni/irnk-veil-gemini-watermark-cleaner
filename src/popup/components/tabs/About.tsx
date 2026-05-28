import { getLogoUrl } from '@/popup/utils';
import { Button, Card, Badge } from '@/popup/components/ui';

export const About = () => {
  const version = chrome.runtime.getManifest().version;
  const docsUrl = chrome.runtime.getURL("index.html");

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <Card className="p-5 text-center">
        <div className="neo-card-soft mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full p-2">
          <img src={getLogoUrl()} alt="IRNK Veil logo" className="h-16 w-16 rounded-full object-contain" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#30343b]">IRNK Veil</h2>
        <p className="mt-1 text-[12px] text-[#7d7468]">Gemini Watermark Cleaner</p>
        <div className="mt-4 flex justify-center gap-2">
          <Badge>IRNK Codes</Badge>
          <Badge>v{version}</Badge>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-[13px] font-bold text-[#30343b]">Purpose</div>
        <p className="mt-2 text-[12px] leading-relaxed text-[#7d7468]">
          Clean Gemini image watermarks locally in your browser with a focused, minimal workflow.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => window.open('https://irnk.codes/veil', '_blank')} size="xs">
          Website
        </Button>
        <Button onClick={() => window.open(docsUrl, '_blank')} size="xs">
          Docs
        </Button>
      </div>

      <p className="px-2 text-center text-[10px] leading-relaxed text-[#9a9082]">
        Independent tool by IRNK Codes. Not affiliated with Google or Gemini.
      </p>
    </div>
  );
};
