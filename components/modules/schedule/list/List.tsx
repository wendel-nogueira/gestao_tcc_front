import { Schedule } from "@/core/models/Schedule";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";

export interface ListScheduleProps {
  schedule: Schedule[];
  setSchedule: (schedule: Schedule[]) => void;
}

export default function ListSchedule(props: ListScheduleProps) {
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  const formSchemaRegister = z.object({
    startDate: z.date().refine((date) => date > new Date(), {
      message: "Start date must be greater than today",
    }),
    endDate: z.date().refine((date) => date > new Date(), {
      message: "End date must be greater than today",
    }),
  });

  const formSchemaPartialVersion = z.object({
    startDate: z.date().refine((date) => date > new Date(), {
      message: "Start date must be greater than today",
    }),
    endDate: z.date().refine((date) => date > new Date(), {
      message: "End date must be greater than today",
    }),
  });

  const formSchemaFinalVersion = z.object({
    startDate: z.date().refine((date) => date > new Date(), {
      message: "Start date must be greater than today",
    }),
    endDate: z.date().refine((date) => date > new Date(), {
      message: "End date must be greater than today",
    }),
  });

  const formSchemaTccDefense = z.object({
    startDate: z.date().refine((date) => date > new Date(), {
      message: "Start date must be greater than today",
    }),
    endDate: z.date().refine((date) => date > new Date(), {
      message: "End date must be greater than today",
    }),
  });

  const formRegister = useForm<z.infer<typeof formSchemaRegister>>({
    resolver: zodResolver(formSchemaRegister),
  });

  const formPartialVersion = useForm<z.infer<typeof formSchemaPartialVersion>>({
    resolver: zodResolver(formSchemaPartialVersion),
  });

  const formFinalVersion = useForm<z.infer<typeof formSchemaFinalVersion>>({
    resolver: zodResolver(formSchemaFinalVersion),
  });

  const formTccDefense = useForm<z.infer<typeof formSchemaTccDefense>>({
    resolver: zodResolver(formSchemaTccDefense),
  });

  const forms = [
    formRegister,
    formPartialVersion,
    formFinalVersion,
    formTccDefense,
  ];

  const info = {
    tcc_register: {
      title: "TCC Registration",
      description: "TCC registration.",
    },
    partial_version: {
      title: "Partial Version",
      description: "Partial version of the TCC.",
    },
    final_version: {
      title: "Final Version",
      description: "Final version of the TCC.",
    },
    tcc_defense: {
      title: "TCC Defense",
      description: "TCC defense.",
    },
  };

  function onSubmit(values: any, index: number) {
    const newSchedule = [...schedule];

    newSchedule[index] = {
      ...newSchedule[index],
      startDate: values.startDate,
      endDate: values.endDate,
    };

    setSchedule(newSchedule);
    props.setSchedule(newSchedule);
  }

  useEffect(() => {
    if (props.schedule && props.schedule.length > 0) {
      setSchedule(props.schedule);

      forms.forEach((form, index) => {
        if (!props.schedule[index].startDate || !props.schedule[index].endDate)
          return;

        form.reset({
          startDate: new Date(props.schedule[index].startDate as string),
          endDate: new Date(props.schedule[index].endDate as string),
        });
      });
    }
  }, [props.schedule]);

  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {schedule.map((item, index) => (
        <Form {...forms[index]} key={index}>
          <form
            onSubmit={forms[index].handleSubmit((values) =>
              onSubmit(values, index)
            )}
            className="space-y-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {info[item.name as keyof typeof info].title}
                </CardTitle>
                <CardDescription>
                  {info[item.name as keyof typeof info].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <FormField
                  control={forms[index].control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col mt-1">
                      <FormLabel className="mb-[6px]">Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={forms[index].control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col mt-1">
                      <FormLabel className="mb-[6px]">End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit">Save</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      ))}
    </div>
  );
}
