"use client";

import { useState } from "react";
import { api, PipelineResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BrainCircuit, Play, Settings2, ShieldCheck, Activity, Code2, MonitorSmartphone } from "lucide-react";

import { PipelineTab } from "./tabs/PipelineTab";
import { ConfigurationTab } from "./tabs/ConfigurationTab";
import { ValidationTab } from "./tabs/ValidationTab";
import { ExecutionTab } from "./tabs/ExecutionTab";
import { PreviewTab } from "./tabs/PreviewTab";
import { MetricsTab } from "./tabs/MetricsTab";

type Stage = "idle" | "pending" | "running" | "success" | "failed";

export function CompilerDashboard() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [data, setData] = useState<PipelineResponse | null>(null);
  
  // Stages: Extraction, Design, Schemas, Validation, Repair, Simulation
  const [stages, setStages] = useState<Stage[]>(Array(6).fill("idle"));

  const updateStage = (index: number, status: Stage) => {
    setStages((prev) => {
      const newStages = [...prev];
      newStages[index] = status;
      return newStages;
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStages(Array(6).fill("pending"));
    setData(null);

    try {
      // Simulate stage progression for UI (actual API is blocking, so we fake it for effect)
      updateStage(0, "running");
      setTimeout(() => { updateStage(0, "success"); updateStage(1, "running"); }, 1000);
      setTimeout(() => { updateStage(1, "success"); updateStage(2, "running"); }, 2000);
      
      const response = await api.generate(prompt);
      setData(response);
      
      updateStage(2, "success");
      updateStage(3, response.validation.valid ? "success" : "failed");
      updateStage(4, "idle"); // we skip repair in default generate visual
      updateStage(5, response.execution.success ? "success" : "failed");

      toast.success("Compilation complete");
    } catch (error: any) {
      toast.error(error.message || "Failed to compile application");
      setStages(prev => prev.map(s => s === "running" || s === "pending" ? "failed" : s));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRepair = async () => {
    if (!data || data.validation.valid) return;
    setIsRepairing(true);
    updateStage(4, "running"); // Repair Engine

    try {
      const response: any = await api.repair(data.schemas, data.validation);
      
      // Backend returns { schemas, revalidation }, not a full PipelineResponse
      const newData = {
        ...data,
        schemas: response.schemas || data.schemas,
        validation: response.revalidation || response.validation || data.validation
      };

      setData(newData);
      updateStage(4, "success");
      updateStage(3, newData.validation.valid ? "success" : "failed");
      // Execution is unchanged as backend doesn't re-simulate execution in repair route
      updateStage(5, "idle");
      toast.success("Repair complete");
    } catch (error: any) {
      toast.error(error.message || "Repair failed");
      updateStage(4, "failed");
    } finally {
      setIsRepairing(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setData(null);
    setStages(Array(6).fill("idle"));
  };

  const STAGES_CONFIG = [
    "Intent Extraction",
    "System Design",
    "Schema Generation",
    "Validation",
    "Repair Engine",
    "Runtime Simulation"
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <BrainCircuit className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI App Compiler</h1>
            <p className="text-muted-foreground">Natural Language → Architecture → Schemas → Validation → Execution</p>
          </div>
        </div>

        <div className="grid gap-4 mt-6">
          <Textarea
            placeholder="Describe the application you want to compile... (e.g. Build an e-commerce platform with products, cart, wishlist, and payments)"
            className="min-h-[120px] font-mono text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex gap-4">
            <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-32">
              {isGenerating ? <Activity className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Generate
            </Button>
            <Button onClick={handleRepair} disabled={isRepairing || !data || data.validation.valid} variant="secondary" className="w-32">
              <Settings2 className="w-4 h-4 mr-2" />
              Repair
            </Button>
            <Button onClick={handleClear} variant="ghost">Clear</Button>
          </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <Card className="bg-card/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -z-10" />
            {STAGES_CONFIG.map((name, i) => (
              <div key={i} className="flex flex-col items-center gap-2 bg-background/80 px-2">
                <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-500
                  ${stages[i] === 'idle' ? 'bg-background border-muted' : ''}
                  ${stages[i] === 'pending' ? 'bg-muted border-muted' : ''}
                  ${stages[i] === 'running' ? 'bg-blue-500 border-blue-500 animate-pulse' : ''}
                  ${stages[i] === 'success' ? 'bg-green-500 border-green-500' : ''}
                  ${stages[i] === 'failed' ? 'bg-red-500 border-red-500' : ''}
                `} />
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      {data && (
        <Tabs defaultValue="pipeline" className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:w-[600px]">
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 min-h-[500px]">
            <TabsContent value="pipeline"><PipelineTab data={data} /></TabsContent>
            <TabsContent value="config"><ConfigurationTab data={data} /></TabsContent>
            <TabsContent value="validation"><ValidationTab data={data} /></TabsContent>
            <TabsContent value="execution"><ExecutionTab data={data} onRepair={handleRepair} /></TabsContent>
            <TabsContent value="preview"><PreviewTab data={data} /></TabsContent>
            <TabsContent value="metrics"><MetricsTab /></TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
}
