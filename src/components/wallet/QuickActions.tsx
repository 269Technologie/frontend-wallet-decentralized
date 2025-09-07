import { ArrowDownLeft, ArrowUpRight, Repeat, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const QuickActions = () => {
  const actions = [
    {
      icon: ArrowDownLeft,
      label: "Receive",
      variant: "default" as const,
    },
    {
      icon: ArrowUpRight,
      label: "Send",
      variant: "outline" as const,
    },
    {
      icon: Repeat,
      label: "Swap",
      variant: "outline" as const,
    },
    {
      icon: Plus,
      label: "Buy",
      variant: "outline" as const,
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-20 flex-col gap-2 hover:scale-105 transition-transform"
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;