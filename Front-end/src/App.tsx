import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Paginas/Home"
import Treinando from "./Paginas/Treinando"
import TreinosPassados from "./Paginas/TreinosPassados"
import Login from "./Paginas/Login"
import CadastroUsuario from "./Paginas/CadastrarUsuario"
import { useEffect } from "react"

function App() {
  useEffect(() => {
    const user = localStorage.getItem("token")
  })
  return (
    <BrowserRouter>

      <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/login`} element={<Login />} />
        <Route path={`/cadastro-usuario`} element={<CadastroUsuario />} />
        <Route path={`/treinando/:idParams`} element={<Treinando />} />
        <Route path={`/treinos-passados/:idParams`} element={<TreinosPassados />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
