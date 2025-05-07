import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Clock, Save, Info, AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import useUser from '@/hooks/user-hooks'
import { useProfessionals } from '@/hooks/professional-hooks'
import { toast } from 'sonner'

const formSchema = z.object({
  workStartHour: z.number().min(0).max(23),
  workEndHour: z
    .number()
    .min(0)
    .max(23)
    .refine((val) => val > 0, {
      message: 'Horário de término deve ser maior que o horário de início',
    }),
  appointmentDuration: z.number().min(15).max(240),
  workDays: z.array(z.string()),
  timeZone: z.string(),
  bufferBetweenSlots: z.number().min(0).max(60),
  maxAdvanceBooking: z.number().min(1).max(365),
  autoAcceptMeetings: z.boolean(),
})

type ProfessionalSettingsFormValues = z.infer<typeof formSchema>

export default function ProfessionalSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()
  const { updateProfessionalSettings, createProfessionalSettings } = useProfessionals()

  const form = useForm<ProfessionalSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workStartHour: 9,
      workEndHour: 17,
      appointmentDuration: 60,
      workDays: ['1', '2', '3', '4', '5'],
      timeZone: 'America/Sao_Paulo',
      bufferBetweenSlots: 0,
      maxAdvanceBooking: 30,
      autoAcceptMeetings: false,
    },
  })

  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return

      try {
        if (user.ProfessionalSettings) {
          const settings = user.ProfessionalSettings

          const workDaysArray = settings.workDays.split(',')

          form.reset({
            workStartHour: settings.workStartHour,
            workEndHour: settings.workEndHour,
            appointmentDuration: settings.appointmentDuration,
            workDays: workDaysArray,
            timeZone: settings.timeZone,
            bufferBetweenSlots: settings.bufferBetweenSlots,
            maxAdvanceBooking: settings.maxAdvanceBooking,
            autoAcceptMeetings: settings.autoAcceptMeetings,
          })
        }
      } catch (error) {
        toast.error('Erro ao carregar configurações')
      }
    }

    loadSettings()
  }, [form, user])

  const onSubmit = async (data: ProfessionalSettingsFormValues) => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      // Convert workDays array to string for API
      const apiData = {
        userId: user.id,
        workStartHour: data.workStartHour,
        workEndHour: data.workEndHour,
        appointmentDuration: data.appointmentDuration,
        workDays: data.workDays.join(','),
        timeZone: data.timeZone,
        bufferBetweenSlots: data.bufferBetweenSlots,
        maxAdvanceBooking: data.maxAdvanceBooking,
        autoAcceptMeetings: data.autoAcceptMeetings,
      }

      if (user.ProfessionalSettings) {
        await updateProfessionalSettings(apiData)
      } else {
        await createProfessionalSettings(apiData)
      }

      toast.success(
        user.ProfessionalSettings
          ? 'Configurações atualizadas'
          : 'Configurações criadas com sucesso'
      )
    } catch (error) {
      toast.error(
        user.ProfessionalSettings
          ? 'Erro ao atualizar configurações'
          : 'Erro ao criar configurações'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const weekdays = [
    { id: '0', label: 'Domingo' },
    { id: '1', label: 'Segunda' },
    { id: '2', label: 'Terça' },
    { id: '3', label: 'Quarta' },
    { id: '4', label: 'Quinta' },
    { id: '5', label: 'Sexta' },
    { id: '6', label: 'Sábado' },
  ]

  const timeZones = [
    { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
    { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
    { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
    { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
  ]

  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return { value: i, label: `${hour}:00` }
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Configurações Profissionais
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas configurações de disponibilidade e agendamento
          </p>
        </div>
      </div>

      {!user?.ProfessionalSettings && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configurações não encontradas</AlertTitle>
          <AlertDescription>
            Você ainda não configurou suas preferências profissionais. Configure abaixo
            para permitir que seus clientes agendem consultas com você.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Disponibilidade e Agendamento
              </CardTitle>
              <CardDescription>
                {!user?.ProfessionalSettings
                  ? 'Crie suas configurações de disponibilidade e agendamento'
                  : 'Configure seus horários de trabalho e preferências de agendamento'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="workStartHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de início</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hourOptions.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value.toString()}>
                              {hour.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Horário em que você começa a atender
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workEndHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de término</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hourOptions.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value.toString()}>
                              {hour.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Horário em que você termina de atender
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="workDays"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Dias de trabalho</FormLabel>
                      <FormDescription>
                        Selecione os dias da semana em que você atende
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {weekdays.map((day) => (
                        <FormField
                          key={day.id}
                          control={form.control}
                          name="workDays"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, day.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{day.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="appointmentDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração da consulta (minutos)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={15}
                          max={240}
                          step={5}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Tempo padrão de duração das suas consultas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bufferBetweenSlots"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Intervalo entre consultas (minutos)</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Tempo de intervalo entre uma consulta e outra. Útil para
                                preparação ou descanso.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={60}
                          step={5}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Tempo de intervalo entre consultas consecutivas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuso horário</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o fuso horário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeZones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Fuso horário para seus agendamentos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxAdvanceBooking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agendamento antecipado máximo (dias)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={365}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Quantos dias no futuro os clientes podem agendar
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="autoAcceptMeetings"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Aceitar agendamentos automaticamente
                      </FormLabel>
                      <FormDescription>
                        Quando ativado, novos agendamentos serão aceitos automaticamente
                        sem sua aprovação
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {!user?.ProfessionalSettings
                      ? 'Criar configurações'
                      : 'Salvar configurações'}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}
