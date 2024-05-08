import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Paginas/Home"
import Treinando from "./Paginas/Treinando"

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/treinando/:idParams`} element={<Treinando />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
