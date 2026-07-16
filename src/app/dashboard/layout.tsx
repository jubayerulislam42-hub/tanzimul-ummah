import { ReactNode } from "react";

// Passthrough layout: individual dashboard pages render their own shell
// (DashboardLayout for the main dashboard, AdminShell for admin panels).
// Rendering chrome here would duplicate the Navbar/header for every page.
export default function DashboardRouteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
