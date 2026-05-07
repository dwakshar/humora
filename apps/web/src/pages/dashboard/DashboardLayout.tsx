import {
  BarChart2,
  Bell,
  Book,
  CreditCard,
  Globe,
  Key,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Receipt,
  Settings,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",       to: "/dashboard",                 end: true },
  { icon: BarChart2,       label: "Analytics",        to: "/dashboard/analytics" },
  { icon: Globe,           label: "My Sites",         to: "/dashboard/sites" },
  { icon: Key,             label: "API Keys",         to: "/dashboard/api-keys" },
  { icon: Book,            label: "Documentation",    to: "/docs" },
  { icon: CreditCard,      label: "Plan & Usage",     to: "/dashboard/billing" },
  { icon: Receipt,         label: "Billing History",  to: "/dashboard/billing-history" },
  { icon: Settings,        label: "Settings",         to: "/dashboard/settings" },
  { icon: MessageCircle,   label: "Support",          to: "/dashboard/support" },
];

function initials(name: string) {
  return name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

export default function DashboardLayout() {
  const { user, logout } = useAuth() as any;
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-[#F5F5F7]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 font-bold text-lg tracking-tight">Humora</div>

        {/* User pill */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-full text-white flex items-center justify-center text-sm font-semibold">
              {initials(user?.name || "U")}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{user?.name || "User"}</div>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full capitalize">
                {user?.plan || "free"}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-0.5 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="m-3 mt-0 text-sm text-gray-400 hover:text-red-500 flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Bell size={20} className="text-gray-500 cursor-pointer" />
            <NavLink
              to="/dashboard/billing"
              className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              Upgrade ↑
            </NavLink>
            <div className="w-8 h-8 bg-indigo-500 rounded-full text-white flex items-center justify-center text-sm font-semibold">
              {initials(user?.name || "U")}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
