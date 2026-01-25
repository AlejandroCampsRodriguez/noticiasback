import React from 'react';
import { Card, Button } from 'react-bootstrap';

function SearchResults({ results }) {
  if (!results || results.length === 0) {
    return (
      <p className="text-center my-4 text-muted">
        No se encontraron resultados.
      </p>
    );
  }

  return (
    <div className="container my-4">
      {results.map((item) => (
        <Card
          key={item.id}
          className="mb-3 shadow-sm"
          style={{ cursor: 'pointer' }}
          onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
        >
          {item.type === 'youtube' && item.thumbnail && (
            <Card.Img
              variant="top"
              src={item.thumbnail}
              alt={item.title}
              style={{ maxHeight: '200px', objectFit: 'cover' }}
            />
          )}

          <Card.Body>
            <Card.Title>{item.title}</Card.Title>

            {item.type === 'web' && item.description && (
              <Card.Text>{item.description}</Card.Text>
            )}

            <Button
              variant="outline-primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // evita que se active el click del Card
                window.open(item.url, '_blank', 'noopener,noreferrer');
              }}
            >
              Abrir enlace
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default SearchResults;
