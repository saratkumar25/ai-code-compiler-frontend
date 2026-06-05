import { PipelineResponse } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PipelineTab({ data }: { data: PipelineResponse }) {
  const { intent, architecture, schemas } = data;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Intent Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">App Name</div>
            <div className="font-semibold">{intent.appName}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
            <div className="text-sm">{intent.description}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">Features</div>
            <div className="flex flex-wrap gap-2">
              {intent.features?.map((f: string, i: number) => (
                <Badge key={i} variant="secondary">{f}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">Entities ({architecture.entities?.length || 0})</div>
            <div className="flex flex-wrap gap-2">
              {architecture.entities?.map((e: any, i: number) => (
                <Badge key={i} variant="outline">{e.name}</Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">Flows</div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {architecture.flows?.map((f: any, i: number) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schemas Generated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Database Tables</span>
            <Badge>{schemas.db?.tables?.length || 0}</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">API Endpoints</span>
            <Badge>{schemas.api?.endpoints?.length || 0}</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">UI Pages</span>
            <Badge>{schemas.ui?.pages?.length || 0}</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Auth Roles</span>
            <Badge>{schemas.auth?.roles?.length || 0}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
