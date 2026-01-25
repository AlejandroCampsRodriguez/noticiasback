import ResultWebItem from './ResultWebItem';
import ResultYoutubeItem from './ResultYoutubeItem';

function SearchResultsContainer({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <section className="mt-4">
      {results.map((item) => {
        if (item.type === 'web') {
          return <ResultWebItem key={item.id} data={item} />;
        }

        if (item.type === 'youtube') {
          return <ResultYoutubeItem key={item.id} data={item} />;
        }

        return null;
      })}
    </section>
  );
}

export default SearchResultsContainer;
