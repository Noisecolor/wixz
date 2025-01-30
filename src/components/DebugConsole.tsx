import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'error' | 'debug';
  message: string;
  details?: any;
}

export class DebugLogger {
  private static logs: LogEntry[] = [];
  private static listeners: ((logs: LogEntry[]) => void)[] = [];

  static log(type: 'info' | 'error' | 'debug', message: string, details?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      details: details ? JSON.stringify(details, null, 2) : undefined
    };
    this.logs.push(entry);
    this.notifyListeners();
  }

  static subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener([...this.logs]));
  }

  static clear() {
    this.logs = [];
    this.notifyListeners();
  }
}

export default function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const unsubscribe = DebugLogger.subscribe(setLogs);
    return () => unsubscribe();
  }, []);

  const copyToClipboard = () => {
    const text = logs.map(log => 
      `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}${log.details ? '\nDetails: ' + log.details : ''}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text).then(() => {
      DebugLogger.log('info', 'Debug logs copied to clipboard');
    });
  };

  const clearLogs = () => {
    DebugLogger.clear();
  };

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      <div 
        className="bg-gray-800 p-2 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-white font-medium">Debug Console</h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            className="p-1 hover:bg-gray-700 rounded"
            title="Copy logs"
          >
            <Copy className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearLogs();
            }}
            className="text-xs text-gray-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {logs.map((log, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  log.type === 'error' ? 'bg-red-500/20 text-red-300' :
                  log.type === 'debug' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {log.type.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-white">{log.message}</p>
              {log.details && (
                <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto text-gray-300">
                  {log.details}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
