import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, PlusCircle, Package, User, ShieldAlert } from 'lucide-react';
import { cn } from '../utils';
import { useAuth } from '../context/AuthContext';

export const BottomNav = () => {
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Market', path: '/categories' },
    { icon: PlusCircle, label: 'Sell', path: '/sell', primary: true },
    { icon: Package, label: 'SkulBox', path: '/skulbox', badge: 'SAVINGS' },
    { 
      icon: user?.role === 'admin' ? ShieldAlert : User, 
      label: user?.role === 'admin' ? 'Admin' : (user ? 'Account' : 'Sign In'), 
      path: user?.role === 'admin' ? '/admin' : '/profile' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full md:hidden h-16 bottom-nav-blur border-t border-gray-200/80 flex items-center justify-around px-2 z-50 shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-full h-full transition-all relative",
              isActive ? "text-amber-600 font-bold" : "text-gray-500 hover:text-gray-800",
              item.primary && "relative -top-3"
            )
          }
        >
          {({ isActive }) => (
            <>
              {item.primary ? (
                <div className="bg-gradient-to-tr from-amber-500 to-orange-500 text-white p-3.5 rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center transform active:scale-95 transition">
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-3 bg-amber-500 text-white text-[8px] font-black px-1 rounded-full uppercase tracking-tighter">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn("text-[10px] mt-1 tracking-tight", isActive ? "font-extrabold text-amber-700" : "font-medium")}>
                    {item.label}
                  </span>
                </>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
