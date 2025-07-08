import './App.css'
import SimuladorCredito from './components/SimuladorCredito'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">


        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <SimuladorCredito />
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          © 2025 Simulador de Crédito
        </footer>
      </div>
    </div>
  )
}

export default App
