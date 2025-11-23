"use client"

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Droplets, GlassWater } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import SubmitButton from "../../components/submitButton";

const SIM_START_DATE = new Date('2024-03-15');
const SIM_START_TIME = 1500;

const chartConfig = {
  intake: { label: "Intake", color: "hsl(var(--chart-6))" },
  output: { label: "Output", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const generateNiceTicks = (max: number, count: number = 6) => {
  if (max === 0) return [0];

  const roughStep = max / (count - 1);
  const power = Math.pow(10, Math.floor(Math.log10(roughStep)));
  let step = 0;

  if (roughStep / power > 5) {
    step = 10 * power;
  } else if (roughStep / power > 2) {
    step = 5 * power;
  } else if (roughStep / power > 1) {
    step = 2 * power;
  } else {
    step = power;
  }

  const ticks = [];
  for (let i = 0; i <= max; i += step) {
    const roundedI = Math.round(i);

    if (roundedI <= max) {
      ticks.push(roundedI);
    }
    if (roundedI === max) break;
  }

  if (ticks[ticks.length - 1] !== max) {
    ticks.push(max);
  }

  return ticks;
};

function getTimeBlocks() {
  const blocks = [];
  const now = new Date(SIM_START_DATE);
  const currentHour = Math.floor(SIM_START_TIME / 100);

  now.setHours(currentHour, 0, 0, 0);

  const isFirstBlock = currentHour < 12;
  let blockStart = new Date(now);

  if (isFirstBlock) {
    blockStart.setDate(blockStart.getDate() - 1);
    blockStart.setHours(12, 0, 0, 0);
  } else {
    blockStart.setHours(0, 0, 0, 0);
  }

  for (let i = 0; i < 4; i++) {
    const start = new Date(blockStart);
    const startTime = start.getHours() === 0 ? "00:00" : "12:00";
    const endTime = start.getHours() === 0 ? "11:59" : "23:59";

    blocks.unshift({
      id: i,
      date: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      startTime,
      endTime,
      label: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    });

    blockStart.setHours(blockStart.getHours() - 12);
  }

  return blocks;
}

export default function IntakeOutputForm() {

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData);
    console.log(payload);
    router.push("/admin/case-builder/form/history");
  }
  const blocks = useMemo(() => getTimeBlocks(), []);

  const [intakeOutput, setIntakeOutput] = useState(
    blocks.map(block => ({ blockId: block.id, intake: 0, output: 0 }))
  );

  const roundedMax = useMemo(() => {
    const max = Math.max(
      ...intakeOutput.map(item => item.intake),
      ...intakeOutput.map(item => item.output),
      2000
    );
    return Math.ceil(max / 500) * 500;
  }, [intakeOutput]);

  const niceTicks = useMemo(() => generateNiceTicks(roundedMax, 6), [roundedMax]);

  const yAxisWidth = useMemo(() => {
    const digits = roundedMax.toString().length;
    return Math.max(48, digits * 12);
  }, [roundedMax]);

  const handleValueChange = (blockId: number, type: 'intake' | 'output', value: string) => {
    if (value === '') {
      setIntakeOutput(prev =>
        prev.map(item => item.blockId === blockId ? { ...item, [type]: 0 } : item)
      );
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setIntakeOutput(prev =>
        prev.map(item => item.blockId === blockId ? { ...item, [type]: numValue } : item)
      );
    }
  };

  const baseTickStyle = { fontSize: 14, fontFamily: 'var(--font-sans)' };

  return (

    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">

      <header className="sticky top-0 flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Droplets className="text-slate-400" />
            Patient Demographics
          </h1>
          <p className="text-xs text-slate-500 mt-1">Step ? of ?: Review and record patient fluid intake and output over the past four 12-hour periods</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:px-8 lg:px-12 w-full">
        <form id="demo-form" onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto space-y-6 pb-20">
          <div className="fixed top-6 right-8 z-10">
            <SubmitButton buttonText="Save & Continue" />
          </div>
          <div className="flex flex-col lg:max-w-3xl 2xl:max-w-4xl w-full">
            <input name='intake-output' type='hidden' value={JSON.stringify(intakeOutput)} />

            <Card className="border-slate-200 shadow-sm w-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GlassWater className="w-5 h-5 text-blue-600" />
                  Intake / Output 12-Hour Block Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4">

                <div className="w-full overflow-x-auto pb-2">
                  <div className="flex gap-2 h-[350px] min-w-[600px] md:min-w-0 md:w-full">
                    {blocks.map((block, index) => {
                      const data = intakeOutput.find(item => item.blockId === block.id) || { intake: 0, output: 0 };

                      const chartData = [{
                        timeBlock: `${block.date}\n${block.startTime}-${block.endTime}`,
                        intake: data.intake,
                        output: data.output,
                      }];

                      return (
                        <Popover key={block.id}>
                          <PopoverTrigger asChild>
                            <div
                              className={`flex-1 min-w-0 h-full hover:bg-slate-50 rounded-md transition-colors p-1 [&_.recharts-surface]:cursor-pointer`}>
                              <ChartContainer config={chartConfig} className="h-full w-full">
                                <BarChart
                                  data={chartData}
                                  margin={{ top: 20, right: 0, left: 0, bottom: 40 }}
                                >
                                  <CartesianGrid vertical={false} horizontal={true} />
                                  <XAxis
                                    dataKey="timeBlock"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tick={baseTickStyle}
                                  />
                                  <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    width={yAxisWidth}
                                    domain={[0, roundedMax]}
                                    ticks={niceTicks}
                                    tick={index === 0
                                      ? baseTickStyle
                                      : { ...baseTickStyle, opacity: 0 }
                                    }
                                    tickFormatter={index === 0 ? (value) => `${value}` : () => ''}
                                  />
                                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                  <Bar
                                    dataKey="intake"
                                    fill="var(--chart-6)"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                  />
                                  <Bar
                                    dataKey="output"
                                    fill="var(--chart-4)"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                  />
                                </BarChart>
                              </ChartContainer>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" side="top" align="center">
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm">
                                {block.date} {block.startTime}-{block.endTime}
                              </h4>
                              <div className="space-y-2">
                                <Label htmlFor={`intake-${block.id}`}>Intake (mL)</Label>
                                <div className="relative">
                                  <Input
                                    id={`intake-${block.id}`}
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={data.intake === 0 ? '' : data.intake}
                                    onChange={(e) => handleValueChange(block.id, 'intake', e.target.value)}
                                    className="pr-8"
                                    placeholder="0"
                                  />
                                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">mL</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`output-${block.id}`}>Output (mL)</Label>
                                <div className="relative">
                                  <Input
                                    id={`output-${block.id}`}
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={data.output === 0 ? '' : data.output}
                                    onChange={(e) => handleValueChange(block.id, 'output', e.target.value)}
                                    className="pr-8"
                                    placeholder="0"
                                  />
                                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">mL</span>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-chart-6"></div>
                    <span className="text-sm text-slate-600">Intake</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-chart-4"></div>
                    <span className="text-sm text-slate-600">Output</span>
                  </div>
                </div>

              </CardContent>
            </Card>
            <p className="text-sm text-slate-500 mt-2 text-center">Click on a bar to enter or edit fluid amounts.</p>
          </div>
        </form>
      </div>
    </div>
  );
}