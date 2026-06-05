import { PipelineResponse } from "@/lib/api";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, Home, LogIn } from "lucide-react";

export function PreviewTab({ data }: { data: PipelineResponse }) {
  const pages = data.schemas?.ui?.pages || [];
  const nav = data.schemas?.ui?.navigation || [];
  
  const [activePage, setActivePage] = useState(pages[0]?.name || "Home");
  
  const currentPage = pages.find((p: any) => p.name === activePage) || pages[0];

  const getIcon = (name: string) => {
    const l = name.toLowerCase();
    if (l.includes("dash")) return <LayoutDashboard className="h-4 w-4" />;
    if (l.includes("cart") || l.includes("order")) return <ShoppingCart className="h-4 w-4" />;
    if (l.includes("user") || l.includes("customer")) return <Users className="h-4 w-4" />;
    if (l.includes("product") || l.includes("invent")) return <Package className="h-4 w-4" />;
    if (l.includes("login") || l.includes("auth")) return <LogIn className="h-4 w-4" />;
    return <Home className="h-4 w-4" />;
  };

  if (!pages.length) return <div className="p-10 text-center text-muted-foreground">No UI Pages generated.</div>;

  return (
    <div className="flex h-[600px] border rounded-xl overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r bg-muted/20 p-4 flex flex-col gap-2">
        <div className="font-bold text-lg mb-4 text-primary px-2">App Preview</div>
        {nav.map((item: string) => {
          const page = pages.find((p: any) => p.name === item);
          if (!page) return null;
          return (
            <button
              key={item}
              onClick={() => setActivePage(item)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === item ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {getIcon(item)}
              {item}
            </button>
          );
        })}
        {/* Render pages not in nav under an "Others" section */}
        <div className="mt-4 pt-4 border-t px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Other Routes
        </div>
        {pages.filter((p: any) => !nav.includes(p.name)).map((p: any) => (
          <button
            key={p.name}
            onClick={() => setActivePage(p.name)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activePage === p.name ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
            }`}
          >
            {getIcon(p.name)}
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto relative">
        {/* Mock Address Bar */}
        <div className="absolute top-0 left-0 w-full bg-muted/40 border-b px-4 py-2 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Route:</span>
            <span className="text-foreground bg-background px-2 py-0.5 rounded border shadow-sm">{currentPage?.path}</span>
          </div>
          {currentPage?.requiredRole && (
            <Badge variant="outline" className="border-amber-500/50 text-amber-500">
              Role: {currentPage.requiredRole}
            </Badge>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{currentPage?.name}</h2>
          
          <div className="grid gap-6">
            {currentPage?.components?.map((comp: any, i: number) => (
              <Card key={i} className="border-dashed shadow-sm">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-sm font-mono flex items-center justify-between">
                    <span>{comp.type} Component</span>
                    <Badge variant="secondary" className="text-[10px] font-sans">
                      {comp.dataSource || "Static/Form"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Rendered Fields: {comp.fields?.join(", ") || "None"}
                  </div>
                  
                  {/* Visual Mock Representation */}
                  <div className="bg-muted/20 border rounded-lg p-4 flex items-center justify-center min-h-[120px]">
                    <div className="text-center space-y-2 w-full max-w-sm">
                      {comp.type.includes("List") || comp.type.includes("Table") ? (
                        <div className="space-y-2">
                          <div className="h-8 bg-muted rounded w-full animate-pulse" />
                          <div className="h-8 bg-muted rounded w-full animate-pulse opacity-80" />
                          <div className="h-8 bg-muted rounded w-full animate-pulse opacity-60" />
                        </div>
                      ) : comp.type.includes("Form") || comp.type.includes("Login") ? (
                        <div className="space-y-3">
                          <div className="h-10 border rounded bg-background w-full" />
                          <div className="h-10 border rounded bg-background w-full" />
                          <div className="h-10 bg-primary rounded w-full" />
                        </div>
                      ) : comp.type.includes("Analytics") || comp.type.includes("Overview") ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-16 bg-muted rounded" />
                          <div className="h-16 bg-muted rounded" />
                        </div>
                      ) : (
                        <div className="h-24 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center rounded">
                          <span className="text-muted-foreground text-sm">Generic Component Area</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {comp.actions?.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {comp.actions.map((act: string, j: number) => (
                        <Badge key={j} variant="outline" className="bg-background">Action: {act}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
