import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const PriceChart = () => {
  const data = [
    { time: "00:00", price: 43250 },
    { time: "04:00", price: 43180 },
    { time: "08:00", price: 43420 },
    { time: "12:00", price: 43520 },
    { time: "16:00", price: 43380 },
    { time: "20:00", price: 43650 },
    { time: "24:00", price: 43720 },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Bitcoin Price</h2>
        <div className="flex items-center gap-2 text-green-500">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">+2.45%</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground">$43,720.50</div>
        <div className="text-sm text-muted-foreground">24h change: +$1,042.30</div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis hide />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PriceChart;