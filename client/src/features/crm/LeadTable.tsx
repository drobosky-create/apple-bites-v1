import React, { useEffect, useState } from 'react';

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  naics: string;
  created_at: string;
  updated_at: string;
}

async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch('/api/leads', { 
    credentials: 'include',
    headers: {
      'x-role': 'admin',
      'x-user': 'admin@example.com'
    }
  });
  if (!res.ok) throw new Error('Failed to load leads');
  return res.json();
}

export default function LeadTable() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchLeads();
        if (mounted) setRows(data);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-4">Loading leads…</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Company</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">NAICS</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-4 py-2">{r.name}</td>
              <td className="px-4 py-2">{r.company}</td>
              <td className="px-4 py-2 text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  r.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  r.status === 'qualified' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {r.status}
                </span>
              </td>
              <td className="px-4 py-2 text-center">{r.naics || '—'}</td>
              <td className="px-4 py-2">{r.email || '—'}</td>
              <td className="px-4 py-2">{r.phone || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}