import { useState } from 'react';
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Footer from "./components/Footer/Footer";
import NewsList from "./components/NewsList/NewsList";
import { Spinner } from 'react-bootstrap';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`
      );

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error al buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <NewsList />
      <SearchBar onSearch={handleSearch} />

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p className="mt-2 text-muted">Buscando en Web y YouTube...</p>
        </div>
      )}

      {!loading && <SearchResults results={results} />}

      <Footer />
    </>
  );
}

export default App;
