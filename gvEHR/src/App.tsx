import Layout from './layout.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SimStudio from './SimStudio.tsx'
import StudentDash from './studentDash.tsx'
import { PtTable } from './components/table.tsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<SimStudio />} />
        </Route>
            <Route path="/student" element={<PtTable />} />
        </Routes> 
    </BrowserRouter>
  )
}

export default App
