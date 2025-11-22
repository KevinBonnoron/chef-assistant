import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { usePwaUpdate } from '@/hooks/use-pwa-update';
import { ThemeProvider } from '@/providers/theme-provider';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ChefHat, Refrigerator, Settings } from 'lucide-react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  usePwaUpdate();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="chef-assistant-theme">
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <ChefHat className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold leading-none tracking-tight">Chef Assistant</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Vos recettes, simplifiées</p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Link to="/pantry" className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                  <Refrigerator className="h-4 w-4" />
                  <span className="hidden sm:inline">Mon frigo</span>
                </Link>
                <Link to="/admin" className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="container mx-auto flex-1 flex flex-col min-h-0 px-4 py-8 md:px-6">
            <NuqsAdapter>
              <Outlet />
            </NuqsAdapter>
          </main>
        </div>
        <Toaster richColors position="bottom-right" />
        <TanStackRouterDevtools />
      </TooltipProvider>
    </ThemeProvider>
  );
}
