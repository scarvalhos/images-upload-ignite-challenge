import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';


type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

type GetImagesResponse = {
  after: string;
  data: Image[];
}

export default function Home(): JSX.Element {
  async function fetchImages({ pageParam = null }): Promise<GetImagesResponse> {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      }
    })

    return response.data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images', fetchImages, {
      getNextPageParam: (lastPage) => lastPage?.after || null
    });

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(imageData => {
      return imageData.data;
    });

    return formatted;
  }, [data]);

  console.log(formattedData)

  if(isLoading) {
    return <Loading />
  }

  if(isError) {
    return <Error />
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        
        { hasNextPage && (
          <Button
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            { isFetchingNextPage ? 'Carregando...' : 'Carregar mais' }
          </Button>
        ) }
      </Box>
    </>
  );
}
