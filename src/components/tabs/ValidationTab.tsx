import { PipelineResponse } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";

export function ValidationTab({ data }: { data: PipelineResponse }) {
  const { validation } = data;

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${validation.valid ? 'border-green-500/50' : 'border-red-500/50'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Validation Score</CardTitle>
          <div className={`text-4xl font-black ${validation.valid ? 'text-green-500' : 'text-red-500'}`}>
            {validation.score || 0}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {validation.valid
              ? "Schemas conform strictly to the compiler contracts."
              : "Schemas violate the required specification and must be repaired."}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              Warnings ({validation.warnings?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validation.warnings?.length > 0 ? (
              <ul className="space-y-2">
                {validation.warnings.map((w: string, i: number) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No warnings reported.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
              {validation.errors?.length > 0 ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5 text-green-500" />}
              Errors ({validation.errors?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validation.errors?.length > 0 ? (
              <ul className="space-y-3">
                {validation.errors.map((e: any, i: number) => (
                  <li key={i} className="text-sm bg-background/50 p-3 rounded-md border border-red-500/20">
                    <div className="font-semibold text-red-500 mb-1">
                      {e.layer?.toUpperCase()} Schema Error
                    </div>
                    <div className="font-mono text-xs text-muted-foreground break-words">
                      Path: {e.path}
                    </div>
                    <div className="mt-1">{e.message}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No structural errors found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
