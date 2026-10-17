import React, { useState, useEffect } from 'react';
import { Plug, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/integrations');
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations || []);
        setDbStatus(data.database);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleTestConnection = async (provider: string) => {
    try {
      const res = await fetch(`/api/v1/integrations/${provider}/test`, { method: 'POST' });
      const data = await res.json();
      setTestResult(data.message || `Tested ${provider} successfully.`);
      setTimeout(() => setTestResult(null), 3000);
    } catch (e) {
      setTestResult(`Failed to test ${provider}`);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Integrations & Connected APIs</h2>
          <p className="text-xs text-[#737373]">Manage backend AI providers, database connections, and social API keys.</p>
        </div>
        <button
          onClick={fetchIntegrations}
          className="flex items-center gap-2 bg-[#050505] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#222222] transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {testResult && (
        <div className="p-4 bg-[#C8F34A]/20 border border-[#C8F34A] rounded-2xl text-xs font-bold text-[#111111]">
          {testResult}
        </div>
      )}

      {dbStatus && (
        <div className={`p-4 rounded-2xl border text-xs font-medium ${dbStatus.connected ? 'bg-[#3B8D50]/10 border-[#3B8D50]/30 text-[#3B8D50]' : 'bg-[#C38A28]/10 border-[#C38A28]/30 text-[#C38A28]'}`}>
          <p className="font-bold mb-0.5">Database Status: {dbStatus.connected ? 'Connected to Supabase PostgreSQL' : 'Fallback Memory Mode'}</p>
          <p>{dbStatus.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item, idx) => (
          <div key={idx} className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#737373] uppercase">API & Integration</span>
              <h3 className="text-sm font-bold text-[#111111]">{item.name}</h3>
              <p className="text-[10px] text-[#3B8D50] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {item.status}
              </p>
            </div>
            <button
              onClick={() => handleTestConnection(item.name.toLowerCase().includes('supabase') ? 'supabase' : 'provider')}
              className="px-4 py-2 bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl text-xs font-bold text-[#111111] hover:bg-[#EEEEEA] transition-all cursor-pointer"
            >
              Test Connection
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
