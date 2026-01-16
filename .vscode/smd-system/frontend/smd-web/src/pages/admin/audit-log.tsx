import React, { useState, useEffect } from 'react';

interface AuditLogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

export default function AuditLog() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 1,
      timestamp: '2024-01-15T10:30:00Z',
      user: 'admin@university.edu',
      action: 'LOGIN',
      resource: 'Authentication',
      details: 'Successful login',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      timestamp: '2024-01-15T10:25:00Z',
      user: 'admin@university.edu',
      action: 'CREATE',
      resource: 'Syllabus',
      details: 'Created syllabus: Introduction to Computer Science',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 3,
      timestamp: '2024-01-15T09:45:00Z',
      user: 'hod@university.edu',
      action: 'APPROVE',
      resource: 'Syllabus',
      details: 'Approved syllabus version 2.1',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      id: 4,
      timestamp: '2024-01-15T09:30:00Z',
      user: 'lecturer@university.edu',
      action: 'UPDATE',
      resource: 'Syllabus',
      details: 'Updated syllabus: Data Structures and Algorithms',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    },
    {
      id: 5,
      timestamp: '2024-01-15T08:15:00Z',
      user: 'admin@university.edu',
      action: 'DELETE',
      resource: 'User',
      details: 'Đã xóa tài khoản người dùng: olduser@university.edu',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ]);

  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>(auditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    let filtered = auditLogs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter) {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    if (userFilter) {
      filtered = filtered.filter(log => log.user === userFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(log =>
        log.timestamp.startsWith(dateFilter)
      );
    }

    setFilteredLogs(filtered);
  }, [searchTerm, actionFilter, userFilter, dateFilter, auditLogs]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'bg-blue-100 text-blue-700';
      case 'LOGOUT': return 'bg-gray-100 text-gray-700';
      case 'CREATE': return 'bg-green-100 text-green-700';
      case 'UPDATE': return 'bg-yellow-100 text-yellow-700';
      case 'DELETE': return 'bg-red-100 text-red-700';
      case 'APPROVE': return 'bg-purple-100 text-purple-700';
      case 'REJECT': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const uniqueActions = Array.from(new Set(auditLogs.map(log => log.action)));
  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.user)));

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Nhật ký Kiểm tra</h1>
        <p className="text-slate-500 font-medium mt-1">Giám sát hoạt động hệ thống và hành động của người dùng</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Bộ lọc</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tìm kiếm</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nhật ký..."
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Action Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Hành động</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tất cả hành động</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Người dùng</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tất cả người dùng</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ngày</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              setSearchTerm('');
              setActionFilter('');
              setUserFilter('');
              setDateFilter('');
            }}
            className="px-6 py-2 border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Action</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Resource</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Details</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">IP Address</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    {log.user}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-medium">Không tìm thấy nhật ký kiểm tra nào phù hợp với tiêu chí của bạn.</p>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Chi tiết Nhật ký Kiểm tra</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Timestamp</label>
                  <p className="text-sm text-slate-600 bg-slate-50 px-4 py-3 rounded-2xl">
                    {formatTimestamp(selectedLog.timestamp)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">User</label>
                  <p className="text-sm text-slate-600 bg-slate-50 px-4 py-3 rounded-2xl">
                    {selectedLog.user}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Action</label>
                  <span className={`inline-block px-3 py-2 rounded-2xl text-sm font-bold ${getActionColor(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resource</label>
                  <p className="text-sm text-slate-600 bg-slate-50 px-4 py-3 rounded-2xl">
                    {selectedLog.resource}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Details</label>
                <p className="text-sm text-slate-600 bg-slate-50 px-4 py-3 rounded-2xl">
                  {selectedLog.details}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">IP Address</label>
                  <p className="text-sm text-slate-600 bg-slate-50 px-4 py-3 rounded-2xl font-mono">
                    {selectedLog.ipAddress}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">User Agent</label>
                  <p className="text-sm text-slate-600 bg-slate-50 px-4 py-3 rounded-2xl break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
