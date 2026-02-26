"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Inbox, FolderOpen, GraduationCap, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { href: "/inbox", label: "INBOX", icon: Inbox },
  { href: "/projects", label: "PROJECTS", icon: FolderOpen },
  { href: "/coaching", label: "COACHING", icon: GraduationCap },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <aside className="flex w-[260px] shrink-0 flex-col justify-between bg-dark-sidebar text-text-light h-screen sticky top-0">
      <div className="flex flex-col gap-0">
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-page-accent">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <span className="font-heading text-lg font-bold tracking-wide">PLAUD</span>
        </div>
        <nav className="flex flex-col">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-6 py-3.5 text-[13px] font-medium tracking-wide transition-colors ${
                  isActive
                    ? "border-t-2 border-page-accent bg-dark-subtle text-white"
                    : "border-t border-dark-border text-text-light-muted hover:bg-dark-surface hover:text-white"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3 px-6 py-6">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-subtle text-sm text-text-light-muted">
            {initials}
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium truncate">{displayName}</span>
          <span className="text-xs text-text-light-muted truncate">{email}</span>
        </div>
        <button onClick={handleSignOut} className="text-text-light-muted hover:text-white transition-colors cursor-pointer" title="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
