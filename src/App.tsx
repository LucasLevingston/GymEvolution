import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Authentication/Login';
import Register from './Pages/Authentication/Register';
import MyInformationsSettings from './Pages/Settings/MyInformations';
import CreateTraining from './Pages/Training/CreateTraining';
import { useUserStore } from './store/user-store';
import NotFound from './Pages/Not-Found';
import { ThemeProvider } from './components/providers/ThemeProvider';
import Profile from './Pages/Profile';
import ThemeSettings from './Pages/Settings/ThemeSettings';
import PastWorkouts from './Pages/Training/PastTrainings';
import CurrentWorkoutWeek from './Pages/Training/TrainingWeekPlan';
import Progress from './Pages/Progress';
import ResetPassword from './Pages/Authentication/ResetPassword';
import PasswordRecovery from './Pages/Authentication/PasswordRecovery';
import DietPlan from './Pages/Diet/DietPlan';
import PastDiets from './Pages/Diet/PastDiets';
import CreateDiet from './Pages/Diet/CreateDiet';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { user } = useUserStore();

  return user ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/progress" element={<PrivateRoute element={<Progress />} />} />
          <Route
            path="/create-training"
            element={<PrivateRoute element={<CreateTraining />} />}
          />

          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />

          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route
            path="/settings/theme"
            element={<PrivateRoute element={<ThemeSettings />} />}
          />
          <Route
            path="/settings/my-informations"
            element={<PrivateRoute element={<MyInformationsSettings />} />}
          />
          <Route
            path="/workout-week"
            element={<PrivateRoute element={<CurrentWorkoutWeek />} />}
          />
          <Route
            path="/training-weeks"
            element={<PrivateRoute element={<PastWorkouts />} />}
          />
          <Route path="/diet" element={<PrivateRoute element={<DietPlan />} />} />
          <Route path="/past-diets" element={<PrivateRoute element={<PastDiets />} />} />
          <Route
            path="/create-diet"
            element={<PrivateRoute element={<CreateDiet />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
