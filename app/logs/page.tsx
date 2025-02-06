'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function LogViewerPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const router = useRouter();

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/logs?date=${date}`);
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchLogs]);

  // Initial fetch and when date changes
  useEffect(() => {
    fetchLogs();
  }, [date, fetchLogs]);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'กำลังโหลด...' : 'รีเฟรช'}
        </button>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
          <span>รีเฟรชอัตโนมัติ (ทุก 30 วินาที)</span>
        </label>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap mb-1">
              {log}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">ไม่พบข้อมูล log</div>
        )}
      </div>

      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full">
          กำลังโหลดข้อมูล...
        </div>
      )}
    </div>
  );
}
