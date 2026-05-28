import { Stats } from '@/popup/types';
import { Button, Card, Badge } from '@/popup/components/ui';

export const Status = ({ isActive, stats, onResetStats }: { isActive: boolean; stats: Stats; onResetStats: () => void }) => {
  const lastProcessed = stats.last_processed
    ? new Date(stats.last_processed).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
    : '—';
  const lastMask = stats.last_image_stats?.maskPercentage
    ? `${stats.last_image_stats.maskPercentage}%`
    : '—';

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[12px] font-semibold text-[#7d7468]">Gemini status</div>
            <div className="mt-2 text-2xl font-black tracking-tight text-[#30343b]">
              {isActive ? 'Cleaning ready' : 'Waiting for Gemini'}
            </div>
            <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-[#7d7468]">
              {isActive ? 'IRNK Veil is active on this Gemini tab.' : 'Open Gemini to activate local cleanup.'}
            </p>
          </div>
          <div className="neo-inset flex h-12 w-12 items-center justify-center rounded-full">
            <span className={`h-3 w-3 rounded-full ${isActive ? 'status-dot-active' : 'status-dot-ready'}`} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <div className="text-[10px] font-semibold text-[#7d7468]">Cleaned</div>
          <div className="mt-1 text-lg font-black text-[#30343b]">{stats.total_images}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-[10px] font-semibold text-[#7d7468]">Last</div>
          <div className="mt-1 text-sm font-black text-[#30343b]">{lastProcessed}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-[10px] font-semibold text-[#7d7468]">Mask</div>
          <div className="mt-1 text-sm font-black text-[#30343b]">{lastMask}</div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[13px] font-bold text-[#30343b]">Local-first cleanup</div>
            <div className="mt-1 text-[11px] text-[#7d7468]">Pixel processing stays in your browser.</div>
          </div>
          <Badge tone="active">Private</Badge>
        </div>
      </Card>

      {stats.total_images > 0 && (
        <Button variant="danger" size="xs" onClick={onResetStats} className="w-full">
          Reset statistics
        </Button>
      )}
    </div>
  );
};
