function ResultYoutubeItem({ data }) {
  return (
    <article className="d-flex mb-4">
      <img
        src={data.thumbnail}
        alt={data.title}
        style={{
          width: '160px',
          height: '90px',
          objectFit: 'cover',
          borderRadius: '6px',
          marginRight: '12px'
        }}
      />

      <div>
        <a
          href={data.url}
          target="_blank"
          rel="noreferrer"
          className="text-decoration-none"
        >
          <h6 className="mb-1">{data.title}</h6>
        </a>

        <div className="text-muted small">YouTube</div>
      </div>
    </article>
  );
}

export default ResultYoutubeItem;
