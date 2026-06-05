import { PipelineResponse } from "@/lib/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ConfigurationTab({ data }: { data: PipelineResponse }) {
  const sections = [
    { id: "intent", title: "Intent Schema", content: data.intent },
    { id: "arch", title: "Architecture Schema", content: data.architecture },
    { id: "ui", title: "UI Schema", content: data.schemas?.ui },
    { id: "api", title: "API Schema", content: data.schemas?.api },
    { id: "db", title: "DB Schema", content: data.schemas?.db },
    { id: "auth", title: "Auth Schema", content: data.schemas?.auth },
  ];

  const handleCopy = (content: any) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <Accordion className="w-full">
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <div className="flex items-center justify-between">
              <AccordionTrigger className="text-lg font-semibold">{section.title}</AccordionTrigger>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(section.content);
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <AccordionContent>
              <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/50 p-4">
                <pre className="text-sm font-mono text-muted-foreground">
                  {JSON.stringify(section.content, null, 2)}
                </pre>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
