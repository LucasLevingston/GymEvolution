import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Paginas/Home"
import Treinando from "./Paginas/Treinando"
import TreinosPassados from "./Paginas/TreinosPassados"
import Login from "./Paginas/Login"

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/login`} element={<Login />} />
        <Route path={`/treinando/:idParams`} element={<Treinando />} />
        <Route path={`/treinos-passados/:idParams`} element={<TreinosPassados />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
