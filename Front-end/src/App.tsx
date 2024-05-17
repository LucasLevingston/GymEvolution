import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Home from "./Paginas/Home"
import { Treinando } from "./Paginas/Treinando"
import { TreinosPassados } from "./Paginas/TreinosPassados"
import Login from "./Paginas/Login"
import CadastroUsuario from "./Paginas/CadastrarUsuario"
import useUser from "./hooks/user-hooks"
import { ReloadIcon } from "@radix-ui/react-icons"
import Container from "./components/Container"
import { useEffect } from "react"
import { DadosPessoais } from "./Paginas/DadosPessoais"
import Evolucao from "./Paginas/Evolucao"
import NovoTreino from "./Paginas/NovoTreino"

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
        (
          <Routes>
            <Route path={`/`} element={<Home />} />
            <Route path={`/login`} element={<Login />} />
            <Route path={`/evolucao`} element={<Evolucao />} />
            <Route path={`/novo-treino`} element={<NovoTreino />} />
            <Route path={`/dados-pessoais`} element={<DadosPessoais />} />
            <Route path={`/cadastro-usuario`} element={<CadastroUsuario />} />
            <Route path={`/treinando/:treinoId`} element={<Treinando />} />
            <Route path={`/treinos-passados`} element={<TreinosPassados />} />
            <Route path={`*`} element={<Navigate to="/login" />} />
          </Routes>
        )}
    </BrowserRouter>
  )
}

export default App
