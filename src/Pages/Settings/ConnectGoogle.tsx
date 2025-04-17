import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  CheckCircle,
  ExternalLink,
  Info,
  LogOut,
  RefreshCw,
  Shield,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useGoogleAuth } from '@/hooks/use-google-auth'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import useUser from '@/hooks/user-hooks'

export default function ConnectGooglePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isConnected, isConnecting, connect, disconnect, connectionInfo, error } =
    useGoogleAuth()
  const [authError, setAuthError] = useState<string | null>(null)

  const { user } = useUser()

  useEffect(() => {
    const errorParam = searchParams.get('error')

    if (errorParam) {
      if (errorParam === 'access_denied') {
        setAuthError(
          'Acesso negado: O aplicativo está em modo de teste e seu e-mail não está na lista de testadores aprovados.'
        )
      } else {
        setAuthError(`Erro de autenticação: ${errorParam}`)
      }
    } else {
      setAuthError(null)
    }
  }, [searchParams])

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Error connecting to Google:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast.success('Successfully disconnected from Google Calendar')
    } catch (error) {
      console.error('Error disconnecting from Google:', error)
      toast.error('Failed to disconnect from Google Calendar')
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Connect Google Calendar
            {isConnected && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Connected
              </Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Connect your Google account to schedule meetings and manage your calendar
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {authError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              {authError}
              <div className="mt-2 text-sm">
                <strong>Solução:</strong> Entre em contato com o administrador do sistema
                para adicionar seu e-mail como testador aprovado.
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Google Calendar Integration
            </CardTitle>
            <CardDescription>
              Connect your Google account to create and manage meetings directly from this
              platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.imageUrl} className="h-5 w-5 text-primary" />{' '}
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-medium">{user?.name}</h1>
                  <p className="">{user?.email}</p>
                </div>
              </div>

              <div>
                {isConnected ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" /> Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className=" text-amber-700">
                    <Info className="h-3 w-3 mr-1" /> Not Connected
                  </Badge>
                )}
              </div>
            </div>

            <Alert className=" border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle>Aplicativo em Modo de Teste</AlertTitle>
              <AlertDescription className="text-sm">
                Este aplicativo está atualmente em modo de teste no Google. Apenas
                usuários aprovados como testadores podem se conectar. Se você não
                conseguir se conectar, entre em contato com o administrador para adicionar
                seu e-mail à lista de testadores.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Why connect your Google Calendar?</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Schedule meetings with professionals directly from this platform
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Receive automatic calendar invites with Google Meet links</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Get reminders for upcoming meetings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Manage all your appointments in one place</span>
                </li>
              </ul>
            </div>

            <Alert className=" border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle>Privacy Information</AlertTitle>
              <AlertDescription className="text-sm">
                We only request access to manage your calendar events. We will never read
                your emails or access other Google services.
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  <Shield className="h-3 w-3" /> View our privacy policy
                </a>
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Separator className="mb-2" />

            {isConnected ? (
              <div className="flex flex-col w-full space-y-2">
                <div className="flex justify-between items-center w-full">
                  <div className="text-sm">
                    <span className="font-medium">Status:</span> Connected to Google
                    Calendar
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDisconnect}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
                <Button onClick={() => navigate('/schedule-meeting')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule a Meeting
                </Button>
              </div>
            ) : (
              <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Connect with Google
                  </>
                )}
              </Button>
            )}

            <p className="text-xs text-muted-foreground text-center mt-2">
              By connecting, you agree to our{' '}
              <a href="/terms" className="underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>
            </p>
          </CardFooter>
        </Card>

        {isConnected && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/meetings')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View My Meetings
            </Button>
          </div>
        )}
      </CardContent>
    </>
  )
}
