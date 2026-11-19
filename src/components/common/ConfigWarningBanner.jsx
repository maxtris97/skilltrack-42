import React from 'react';
import { AlertTriangle, Database, ExternalLink } from 'lucide-react';

export default function ConfigWarningBanner() {
  return (
    <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-200">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white text-sm">Supabase Credentials Not Configured</h3>
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              Action Required
            </span>
          </div>
          <p className="mt-1 text-slate-300 leading-relaxed">
            Authentication and database persistence require your Supabase project credentials.
            Create a <code className="rounded bg-slate-900 px-1.5 py-0.5 text-amber-300 font-mono">.env</code> file
            in the project root with your project URL and anon public key:
          </p>
          <div className="mt-2.5 rounded-xl border border-surface-border bg-slate-950/80 p-3 font-mono text-[11px] text-slate-300 overflow-x-auto select-all">
            VITE_SUPABASE_URL=https://&lt;your-project&gt;.supabase.co<br />
            VITE_SUPABASE_PUBLISHABLE_KEY=&lt;your-anon-public-key&gt;
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Never put your secret <code className="text-rose-400">service_role</code> key into frontend code.
          </p>
        </div>
      </div>
    </div>
  );
}
