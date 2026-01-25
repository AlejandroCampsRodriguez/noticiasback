import  { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Card, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { noticias } from './BancoLink';

function NewsList() {
  const [noticiasConMeta, setNoticiasConMeta] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);

  // Función para extraer metadatos de una URL
  const extraerMetadatos = async (url) => {
    try {
      // Usamos un proxy CORS para evitar problemas
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const encodedUrl = encodeURIComponent(url);
      
      const response = await fetch(`${proxyUrl}${encodedUrl}`, {
        timeout: 10000
      });
      
      const data = await response.json();
      const html = data.contents;
      
      // Crear un DOM temporal para parsear el HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extraer metadatos Open Graph
      const getMeta = (name) => {
        const meta = doc.querySelector(`meta[property="og:${name}"]`) || 
                    doc.querySelector(`meta[name="${name}"]`) ||
                    doc.querySelector(`meta[name="twitter:${name}"]`);
        return meta ? meta.getAttribute('content') : null;
      };

      const titulo = getMeta('title') || doc.querySelector('title')?.textContent || 'Sin título';
      const descripcion = getMeta('description') || 
                         doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                         'Sin descripción';
      
      // Buscar imagen - priorizar Open Graph, luego Twitter, luego primera imagen grande
      let imagen = getMeta('image');
      
      if (!imagen) {
        // Buscar la primera imagen grande en el contenido
        const imagenes = doc.querySelectorAll('img');
        for (let img of imagenes) {
          const src = img.getAttribute('src');
          if (src && (src.includes('.jpg') || src.includes('.png') || src.includes('.jpeg'))) {
            // Verificar si es una URL completa
            if (src.startsWith('http')) {
              imagen = src;
            } else {
              // Convertir URL relativa a absoluta
              const baseUrl = new URL(url).origin;
              imagen = new URL(src, baseUrl).href;
            }
            break;
          }
        }
      }
      
      // Si no encontramos imagen, usar screenshot del servicio WordPress
      if (!imagen) {
        imagen = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`;
      }
      
      return {
        titulo: titulo,
        descripcion: descripcion.length > 150 ? descripcion.substring(0, 150) + '...' : descripcion,
        imagen: imagen,
        fuente: new URL(url).hostname.replace('www.', ''),
        fecha: new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
    } catch (error) {
      console.error('Error extrayendo metadatos:', error);
      return null;
    }
  };

  // Cargar metadatos para todas las noticias
  useEffect(() => {
    const cargarMetadatos = async () => {
      setCargando(true);
      try {
        const noticiasActualizadas = await Promise.all(
          noticias.map(async (noticia, idx) => {
            // Si ya tenemos imagen en los datos, usarla directamente
            if (noticia.imagen && !noticia.imagen.includes('placeholder')) {
              return {
                ...noticia,
                titulo: noticia.titulo || `Noticia ${idx + 1}`,
                descripcion: noticia.descripcion || 'Descripción no disponible',
                fuente: noticia.fuente || new URL(noticia.enlace).hostname.replace('www.', ''),
                fecha: noticia.fecha || new Date().toLocaleDateString()
              };
            }
            
            // Extraer metadatos del enlace
            const metadatos = await extraerMetadatos(noticia.enlace);
            
            if (metadatos) {
              return {
                ...noticia,
                titulo: metadatos.titulo,
                descripcion: metadatos.descripcion,
                imagen: metadatos.imagen,
                fuente: metadatos.fuente,
                fecha: metadatos.fecha
              };
            }
            
            // Fallback si no se pueden extraer metadatos
            return {
              ...noticia,
              titulo: noticia.titulo || 'No se pudo cargar la noticia',
              descripcion: noticia.descripcion || 'Haz clic para visitar el sitio',
              imagen: noticia.imagen || `https://s.wordpress.com/mshots/v1/${encodeURIComponent(noticia.enlace)}?w=1200`,
              fuente: noticia.fuente || new URL(noticia.enlace).hostname.replace('www.', ''),
              fecha: noticia.fecha || new Date().toLocaleDateString()
            };
          })
        );
        
        setNoticiasConMeta(noticiasActualizadas);
        setCargando(false);
      } catch (error) {
        console.error('Error cargando noticias:', error);
        setError('Error al cargar las noticias');
        setCargando(false);
      }
    };

    cargarMetadatos();
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleNoticiaClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (cargando) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Cargando noticias...</span>
        </Spinner>
        <p className="mt-3 text-muted">Extrayendo información de los enlaces...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <Carousel activeIndex={index} onSelect={handleSelect} interval={5000} pause="hover">
        {noticiasConMeta.map((noticia, idx) => (
          <Carousel.Item key={idx}>
            <div 
              className="d-block w-100 position-relative"
              style={{ 
                height: '450px',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${noticia.imagen})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer'
              }}
              onClick={() => handleNoticiaClick(noticia.enlace)}
            >
              {/* Miniatura overlay - versión mejorada */}
              <div
                className="position-absolute"
                style={{
                  bottom: '12px',
                  right: '12px',
                  zIndex: 10
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNoticiaClick(noticia.enlace);
                }}
              >
                <div
                  className="bg-white rounded shadow-sm p-1"
                  style={{
                    border: '2px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                
                 
                </div>
              </div>
            </div>
            
            <Carousel.Caption 
              className="text-start p-4"
              style={{
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: '60px'
              }}
            >
              <Card className="bg-dark bg-opacity-75 border-0">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary bg-opacity-90">
                      {noticia.fuente}
                    </span>
                    <small className="text-light opacity-75">
                      {noticia.fecha}
                    </small>
                  </div>
                  <Card.Title className="text-white mb-2 fs-4">
                    {noticia.titulo}
                  </Card.Title>
                  <Card.Text className="text-light mb-3 opacity-90">
                    {noticia.descripcion}
                  </Card.Text>
                  <Button 
                    variant="outline-light"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNoticiaClick(noticia.enlace);
                    }}
                    className="d-flex align-items-center gap-2"
                  >
                    <span>Leer noticia completa</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                      <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                    </svg>
                  </Button>
                </Card.Body>
              </Card>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
        
        {/* Fallback si no hay noticias */}
        {noticiasConMeta.length === 0 && noticias.map((noticia, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={
                noticia.enlace
                  ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(noticia.enlace)}?w=1200`
                  : noticia.imagen || `/casa_0${(idx % 3) + 1}.jpg`
              }
              alt={`Noticia ${idx + 1}`}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>{noticia.titulo || `Noticia ${idx + 1}`}</h3>
              <p>{noticia.descripcion || 'Descripción no disponible'}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default NewsList;