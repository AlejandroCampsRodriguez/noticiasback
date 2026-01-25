function ResultWebItem({ data }) {
  return (
    <article className="mb-4">
      <a
        href={data.url}
        target="_blank"
        rel="noreferrer"
        className="text-decoration-none"
      >
        <h5 className="mb-1 text-primary">{data.title}</h5>
      </a>

      <div className="text-muted small mb-1">{data.url}</div>

      <p className="mb-0">{data.description}</p>
    </article>
  );
}

export default ResultWebItem;
