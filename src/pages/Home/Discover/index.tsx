import { useNavigation } from '@react-navigation/native';
import { BookList } from 'components/BookList';
import { PageLayout } from 'components/PageLayout';
import { useBooks } from 'contexts/booksContext';
import { useMemo } from 'react';
import { RouteName, RouteParams, StackNavigation } from 'routes/types';
import { Categories } from './components/Categories';
import { categoriesFromIds } from './utils/categoriesFromIds';

export const Discover = ({}: RouteParams<RouteName.Discover>) => {
  const stackNavigation = useNavigation<StackNavigation>();
  const { library } = useBooks();
  const categories = useMemo(() => {
    return categoriesFromIds([1, 2, 3, 4, 5, 16, 23, 26]);
  }, []);

  return (
    <PageLayout>
      <BookList
        title="Para você"
        books={library}
        onSeeAll={() =>
          stackNavigation.navigate(RouteName.BookList, {
            books: library,
            title: 'Para você',
          })
        }
      />

      <Categories
        categories={categories}
        onSelectCategory={(category) =>
          stackNavigation.navigate(RouteName.BookList, {
            title: `${category.emoji} ${category.name}`,
            books: library,
          })
        }
      />

      <BookList
        title="Últimos lançamentos"
        books={library}
        onSeeAll={() =>
          stackNavigation.navigate(RouteName.BookList, {
            title: 'Últimos lançamentos',
            books: library,
          })
        }
      />

      <BookList
        title="Para ganhar dinheiro"
        books={library}
        onSeeAll={() =>
          stackNavigation.navigate(RouteName.BookList, {
            title: 'Para ganhar dinheiro',
            books: library,
          })
        }
      />
    </PageLayout>
  );
};
