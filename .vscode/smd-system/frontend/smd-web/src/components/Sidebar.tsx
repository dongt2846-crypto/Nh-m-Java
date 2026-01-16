import { useRouter } from 'next/router';
import Link from 'next/link';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userRole: string;
}

export default function Sidebar({ open, setOpen, userRole }: SidebarProps) {
  const router = useRouter();

  const getNavigationItems = () => {
    switch (userRole) {
      case 'SYSTEM_ADMIN':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
          { name: 'Users', href: '/admin/users', icon: '👥' },
          { name: 'System Config', href: '/admin/system-config', icon: '⚙️' },
          { name: 'Workflow Config', href: '/admin/workflow-config', icon: '🔄' },
          { name: 'Publish', href: '/admin/publish', icon: '📢' },
          { name: 'Audit Log', href: '/admin/audit-log', icon: '📋' },
        ];
      
      case 'LECTURER':
        return [
          { name: 'Dashboard', href: '/lecturer', icon: '📊' },
          { name: 'Create Syllabus', href: '/lecturer/create', icon: '➕' },
          { name: 'My Syllabi', href: '/lecturer/syllabi', icon: '📚' },
          { name: 'Notifications', href: '/lecturer/notifications', icon: '🔔' },
        ];
      
      case 'HOD':
        return [
          { name: 'Dashboard', href: '/hod', icon: '📊' },
          { name: 'Review Queue', href: '/hod/review', icon: '📝' },
          { name: 'Compare Versions', href: '/hod/compare', icon: '🔍' },
          { name: 'Team Review', href: '/hod/collaborative-review', icon: '👥' },
        ];
      
      case 'ACADEMIC_AFFAIRS':
        return [
          { name: 'Dashboard', href: '/academic-affairs/dashboard', icon: '📊' },
          { name: 'Final Review', href: '/academic-affairs/review', icon: '✅' },
          { name: 'PLO Management', href: '/academic-affairs/plo-management', icon: '🎯' },
          { name: 'Program Structure', href: '/academic-affairs/program-structure', icon: '🏗️' },
          { name: 'Reports', href: '/academic-affairs/reports', icon: '📈' },
        ];
      
      case 'PRINCIPAL':
        return [
          { name: 'Dashboard', href: '/principal/dashboard', icon: '📊' },
          { name: 'Final Approval', href: '/principal/final-approval', icon: '✅' },
          { name: 'Executive Reports', href: '/principal/reports', icon: '📈' },
        ];
      
      case 'STUDENT':
        return [
          { name: 'Search Courses', href: '/student/search', icon: '🔍' },
          { name: 'Course Catalog', href: '/student/catalog', icon: '📚' },
          { name: 'AI Summaries', href: '/student/ai-summary', icon: '🤖' },
          { name: 'Subject Tree', href: '/student/subject-tree', icon: '🌳' },
          { name: 'Feedback', href: '/student/feedback', icon: '💬' },
        ];
      
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 flex flex-col
        ${open ? 'w-64' : 'w-20'}
        bg-white border-r border-gray-200 transition-all duration-300
        lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {open && (
              <span className="text-xl font-bold text-gray-900">SMD</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {open && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${open ? 'justify-between' : 'justify-center'}`}>
            {open && (
              <div className="text-xs text-gray-500">
                SMD System v1.0
              </div>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg 
                className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}