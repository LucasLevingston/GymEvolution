// @jsx App.tsx

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import { Treinando } from './Pages/Treinando';
import { TreinosPassados } from './Pages/TreinosPassados';
import Login from './Pages/Login';
import CadastroUsuario from './Pages/CadastrarUsuario';
import { DadosPessoais } from './Pages/DadosPessoais';
import Evolution from './Pages/Evolution';
import NovoTreino from './Pages/NovoTreino';

function App() {
	return (
		<BrowserRouter>
			{
				// loading ? (
				//   <Container className="flex h-full w-full flex-col items-center justify-center space-y-5">
				//     <div>Carregando...</div>
				//     <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				//   </Container>
				// ) :
				<Routes>
					<Route path={`/`} element={<Home />} />
					<Route path={`/login`} element={<Login />} />
					<Route path={`/evolucao`} element={<Evolution />} />
					<Route path={`/novo-treino`} element={<NovoTreino />} />
					<Route path={`/dados-pessoais`} element={<DadosPessoais />} />
					<Route path={`/cadastro-usuario`} element={<CadastroUsuario />} />
					<Route path={`/treinando/:treinoId`} element={<Treinando />} />
					<Route path={`/treinos-passados`} element={<TreinosPassados />} />
					<Route path={`*`} element={<Navigate to="/login" />} />
				</Routes>
			}
		</BrowserRouter>
	);
}

export default App;
