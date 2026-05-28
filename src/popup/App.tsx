import { useState, useEffect } from 'react';
import { FiActivity, FiInfo, FiSettings } from 'react-icons/fi';

import { Settings, Stats } from '@/popup/types';
import { getLogoUrl } from '@/popup/utils';
import { TabButton, Toast, useToast, Badge } from '@/popup/components/ui';
import { Status, SettingsTab, About } from '@/popup/components/tabs';

const defaultSettings: Settings = {
  enabled: true,
  alphaThreshold: 0.002,
  maxAlpha: 0.99,
  debug: false
};

const defaultStats: Stats = {
  total_images: 0,
  last_processed: 0,
  last_image_stats: null
};

export default function App() {
  const [activeTab, setActiveTab] = useState('status');
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const { messages, addToast, dismissToast } = useToast();

  useEffect(() => {
    // Legacy keys are intentionally read for migration compatibility.
    chrome.storage.local.get(['gwc_settings', 'gwc_stats', 'gwrEnabled'], (stored) => {
      const storedSettings = stored.gwc_settings ? { ...defaultSettings, ...stored.gwc_settings } : defaultSettings;
      const nextSettings = {
        ...storedSettings,
        enabled: typeof stored.gwrEnabled === 'boolean' ? stored.gwrEnabled : storedSettings.enabled,
      };
      setSettings(nextSettings);

      if (stored.gwc_stats) {
        setStats({ ...defaultStats, ...stored.gwc_stats });
      }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const current = tabs[0];
      setIsActive(current?.url?.includes("gemini.google.com") || false);
    });

    const listener = (message: { type: string; stats: Stats }) => {
      if (message.type === 'GWC_STATS_UPDATE') {
        setStats(message.stats);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [addToast]);

  const handleSettingsUpdate = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    chrome.storage.local.set({
      gwc_settings: updated,
      gwrEnabled: updated.enabled !== false,
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'GWC_SETTINGS_UPDATE', settings: updated }).catch(() => {
          // Tab may not have content script
        });
      }
    });
  };

  const handleResetStats = () => {
    const resetStats = { ...defaultStats };
    setStats(resetStats);
    chrome.storage.local.set({ gwc_stats: resetStats });
    addToast('Statistics cleared', 'info');
  };

  const tabs = [
    { key: 'status', label: 'Status', icon: <FiActivity /> },
    { key: 'settings', label: 'Settings', icon: <FiSettings /> },
    { key: 'about', label: 'Info', icon: <FiInfo /> },
  ];

  const state = !settings.enabled
    ? { label: 'Paused', tone: 'warning' as const, dot: 'status-dot-paused' }
    : isActive
      ? { label: 'Active', tone: 'active' as const, dot: 'status-dot-active' }
      : { label: 'Ready', tone: 'warning' as const, dot: 'status-dot-ready' };

  return (
    <div className="neo-shell relative h-[500px] w-[360px] overflow-hidden font-sans selection:bg-[#ffc400]/30">
      <div className="flex h-full flex-col p-4">
        <header className="shrink-0">
          <div className="mb-4 flex items-center gap-3">
            <div className="neo-card-soft flex h-[52px] w-[52px] items-center justify-center rounded-[22px] p-1.5">
              <img src={getLogoUrl()} alt="IRNK Veil logo" className="h-10 w-10 rounded-full object-contain" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-[19px] font-black leading-none tracking-tight text-[#30343b]">IRNK Veil</h1>
              <p className="mt-1 text-[11px] font-medium text-[#7d7468]">Gemini Watermark Cleaner</p>
            </div>

            <Badge tone={state.tone}>
              <span className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${state.dot}`} />
                {state.label}
              </span>
            </Badge>
          </div>

          <nav className="grid grid-cols-3 gap-2" role="tablist" aria-label="IRNK Veil popup sections">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </nav>
        </header>

        <main className="mt-4 flex-1 overflow-y-auto overflow-x-hidden">
          {activeTab === 'status' && <Status isActive={isActive && settings.enabled} stats={stats} onResetStats={handleResetStats} />}
          {activeTab === 'settings' && <SettingsTab settings={settings} onUpdate={handleSettingsUpdate} />}
          {activeTab === 'about' && <About />}
        </main>
      </div>

      <Toast messages={messages} onDismiss={dismissToast} />
    </div>
  );
}
