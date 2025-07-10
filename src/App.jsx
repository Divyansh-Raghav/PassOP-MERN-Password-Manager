import './App.css';
import Navbar from './components/Navbar';
import Manager from './components/Manager';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content with flex-grow */}
      <main className="flex-grow">
        <Manager />
      </main>

      <Footer />
    </div>
  );
}

export default App;
