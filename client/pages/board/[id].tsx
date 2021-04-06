import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import BoardDetail from '../../components/board/BoardDetail';
import Layout from '../../components/main/Layout';
import { Board, Reply } from '../../interfaces';
import SERVER from '../../utils/url';

interface Props {
	pageProps: {
		board: Board;
		replies: Reply[];
	};
}

const BoardDetailPage = ({ pageProps }: Props) => {
	return (
		<Layout>
			<BoardDetail {...pageProps} />
		</Layout>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	// Get the paths we want to pre-render based on users

	const paths = await (
		await axios.get(`${SERVER}/api/board/list`)
	).data.list.map((board) => ({
		params: { id: board.id.toString() },
	}));

	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const res = await axios.post(`${SERVER}/api/board/load`, { id: params.id });

	return { props: { board: res.data.board, replies: res.data.reply || [] } };
};

export default BoardDetailPage;
