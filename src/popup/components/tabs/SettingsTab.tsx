import { Card, SectionTitle, Button } from '@/popup/components/ui';
import { Settings } from '@/popup/types';

const defaultSettings: Settings = {
  enabled: true,
  alphaThreshold: 0.002,
  maxAlpha: 0.99,
  debug: false,
};

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
  <label className="relative inline-flex cursor-pointer items-center">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
    <span className="neo-inset relative h-8 w-14 rounded-full transition-all after:absolute after:left-1.5 after:top-1.5 after:h-5 after:w-5 after:rounded-full after:bg-[#f8f3e9] after:shadow-[3px_3px_7px_rgba(185,174,156,0.5),-2px_-2px_6px_rgba(255,255,255,0.9)] after:transition-transform after:content-[''] peer-checked:after:translate-x-6 peer-checked:after:bg-[#ffc400]" />
  </label>
);

export const SettingsTab = ({ settings, onUpdate }: { settings: Settings; onUpdate: (s: Partial<Settings>) => void }) => {
  const handleResetDefaults = () => {
    onUpdate(defaultSettings);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'irnk-veil-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          if (typeof imported === 'object' && imported !== null) {
            onUpdate({ ...defaultSettings, ...imported });
          }
        } catch {
          console.error('IRNK Veil | Failed to parse settings file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <Card className="flex items-center justify-between gap-4 p-4">
        <div>
          <div className="text-[14px] font-black text-[#30343b]">Enable cleanup</div>
          <div className="mt-1 text-[11px] text-[#7d7468]">Run on supported Gemini pages.</div>
        </div>
        <Toggle checked={settings.enabled} onChange={(enabled) => onUpdate({ enabled })} />
      </Card>

      <Card>
        <SectionTitle>Precision</SectionTitle>
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#30343b]">Alpha threshold</span>
          <span className="text-[12px] font-semibold text-[#7d7468]">{settings.alphaThreshold}</span>
        </div>
        <input
          type="range"
          min="0.001"
          max="0.01"
          step="0.001"
          value={settings.alphaThreshold}
          onChange={(e) => onUpdate({ alphaThreshold: parseFloat(e.target.value) })}
          className="mt-3 w-full"
        />
      </Card>

      <Card>
        <SectionTitle>Reconstruction</SectionTitle>
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#30343b]">Max alpha</span>
          <span className="text-[12px] font-semibold text-[#7d7468]">{settings.maxAlpha}</span>
        </div>
        <input
          type="range"
          min="0.90"
          max="1.00"
          step="0.01"
          value={settings.maxAlpha}
          onChange={(e) => onUpdate({ maxAlpha: parseFloat(e.target.value) })}
          className="mt-3 w-full"
        />
      </Card>

      <Card className="flex items-center justify-between gap-4 p-4">
        <div>
          <div className="text-[13px] font-bold text-[#30343b]">Debug logs</div>
          <div className="mt-1 text-[11px] text-[#7d7468]">Only needed for troubleshooting.</div>
        </div>
        <Toggle checked={settings.debug} onChange={(debug) => onUpdate({ debug })} />
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <Button onClick={handleExport} size="xs">Export</Button>
        <Button onClick={handleImport} size="xs">Import</Button>
        <Button variant="danger" size="xs" onClick={handleResetDefaults}>Reset</Button>
      </div>
    </div>
  );
};
