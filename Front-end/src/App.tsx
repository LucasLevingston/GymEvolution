import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import { Treinando } from './Pages/Treinando';
import { TreinosPassados } from './Pages/TreinosPassados';
import Login from './Pages/Login';
import CreateUser from './Pages/CreateUser';
import MyInformationsSettings from './Pages/Settings/MyInformations';
import Evolution from './Pages/Evolution';
import CreateTraining from './Pages/NewTraining';
import { useUserStore } from './store/user-store';
import NotFound from './Pages/Not-Found';
import { ThemeProvider } from './components/providers/ThemeProvider';
import Profile from './Pages/Profile';
import ThemeSettings from './Pages/Settings/ThemeSettings';
import { TrainingWeek } from './Pages/TrainingWeek';

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
					<Route
						path="/evolution"
						element={<PrivateRoute element={<Evolution />} />}
					/>
					<Route
						path="/new-training"
						element={<PrivateRoute element={<CreateTraining />} />}
					/>

					<Route path="/register" element={<CreateUser />} />
					<Route
						path="/training/:treinoId"
						element={<PrivateRoute element={<Treinando />} />}
					/>
					<Route
						path="/treinos-passados"
						element={<PrivateRoute element={<TreinosPassados />} />}
					/>
					<Route
						path="/profile"
						element={<PrivateRoute element={<Profile />} />}
					/>
					<Route
						path="/settings/theme"
						element={<PrivateRoute element={<ThemeSettings />} />}
					/>
					<Route
						path="/settings/my-informations"
						element={<PrivateRoute element={<MyInformationsSettings />} />}
					/>
					<Route
						path="/training-week"
						element={<PrivateRoute element={<TrainingWeek />} />}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
};

export default App;
