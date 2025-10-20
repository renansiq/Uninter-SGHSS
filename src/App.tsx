import { useState } from 'react';
import { AppointmentForm } from '@/components/AppointmentForm';
import { AppointmentsList } from '@/components/AppointmentsList';
import { LoginForm } from '@/components/LoginForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List, LogOut } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/lib/mockData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const handleAppointmentSuccess = () => {
    setActiveTab('list');
    setRefreshKey((prev) => prev + 1);
    setEditingAppointment(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setActiveTab('form');
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
  };

  const handleLogin = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('form');
    setEditingAppointment(null);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container max-w-full mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
                Sistema de Agendamento
              </h1>
              <p className="text-lg text-slate-600">
                Agende sua consulta médica de forma rápida e prática
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Nova Consulta
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Consultas Agendadas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <AppointmentForm 
              onSuccess={handleAppointmentSuccess}
              editingAppointment={editingAppointment}
              onCancelEdit={handleCancelEdit}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <AppointmentsList 
              key={refreshKey}
              onEditAppointment={handleEditAppointment}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
