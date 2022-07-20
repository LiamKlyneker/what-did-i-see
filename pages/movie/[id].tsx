import { useEffect } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Layout from "src/layout/default";
import useFetchMovie from "src/hooks/useFetchMovie";
import { Movie } from "src/types/movie";
import { Typography } from "#atoms";
import { MovieDetailTile } from "#components";

interface MovieDetailPageProps {
  asPortal?: boolean;
  movieId?: string;
  data?: Movie;
}

const MovieDetailPage: NextPage<MovieDetailPageProps> = props => {
  const { asPortal = false, data, movieId } = props;
  const {
    isLoading,
    performFetch,
    data: movieDetails,
  } = useFetchMovie(movieId);

  useEffect(() => {
    asPortal && performFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (asPortal) {
    return (
      <>
        {isLoading && <p>Loading...</p>}
        {!isLoading && movieDetails && <PageContent data={movieDetails} />}
      </>
    );
  }
  return (
    <Layout>
      <PageContent data={data} />
    </Layout>
  );
};

const PageContent = (props: MovieDetailPageProps) => {
  const { data } = props;
  return (
    <>
      <Head>
        <title>Movie Detail</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <MovieDetailTile movie={data as Movie} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const response = await fetch(
    `${baseUrl}/api/omdb?${new URLSearchParams({
      i: context.query.id,
    } as Record<string, string>)}`
  );
  const movie = await response.json();
  return { props: { data: movie } };
};

export default MovieDetailPage;
