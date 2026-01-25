import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <Form onSubmit={handleSubmit} className="my-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Buscar canales o noticias (ej: midudev)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Buscar
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchBar;
