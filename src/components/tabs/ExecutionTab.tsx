import { PipelineResponse } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Settings2, CheckCircle2, XCircle } from "lucide-react";

export function ExecutionTab({ data, onRepair }: { data: PipelineResponse; onRepair: () => void }) {
  const { execution } = data;
  const passedCount = execution.checks.filter(c => c.passed).length;
  const totalCount = execution.checks.length;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Execution Readiness</CardTitle>
            <div className="text-sm text-muted-foreground">
              Simulated runtime checks against the generated architecture
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{execution.readiness}%</div>
            <div className="text-sm text-muted-foreground">{passedCount} / {totalCount} Passed</div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={execution.readiness} className="h-2" />
        </CardContent>
      </Card>

      {!execution.success && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-500 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Execution Failed
            </h3>
            <p className="text-sm text-red-500/80 mt-1">
              The generated application configuration contains logical errors and cannot be safely executed.
            </p>
          </div>
          {!data.validation.valid ? (
            <Button onClick={onRepair} variant="destructive">
              <Settings2 className="mr-2 h-4 w-4" />
              Repair Configuration
            </Button>
          ) : (
            <p className="text-sm text-red-400 font-medium max-w-sm text-right">
              Schemas are structurally valid. To fix these logical execution failures, please refine your prompt.
            </p>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {execution.checks.map((check: any, i: number) => (
          <Card key={i} className={`border-l-4 ${check.passed ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {check.passed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                {check.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className={`text-xs ${check.passed ? 'text-muted-foreground' : 'text-red-400 font-medium'}`}>
                {check.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Execution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{execution.summary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
