import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews';
import { useState } from 'react';

import '@wordpress/dataviews/build-style/style.css';
import '@wordpress/components/build-style/style.css';

import { COUNCILS, PROVINCES } from './data';

const formatNumber = (number) => new Intl.NumberFormat('en-EN').format(number);

function App() {
	const [data, setData] = useState(COUNCILS);

	const [paginationInfo, setPaginationInfo] = useState({
		totalItems: 0,
		totalPages: 0,
	});
	const [view, setView] = useState({
		type: 'table',
		hiddenFields: ['img_src'],
		perPage: 10,
		layout: {
			primaryField: 'name',
			mediaField: 'img_src',
			badgeFields: ['province'],
			columnFields: [],
		},
		filters: [],
	});

	const fields = [
		{
			id: "img_src",
			header: "Image",
			render: ({ item }) => <a title={item.img_author} href={item.img_url}><img width="512" src={item.img_src} /></a>,
			enableSorting: false,
		},
		{
			id: 'name',
			header: 'Name',
			enableGlobalSearch: true,
		},
		{
			id: 'province',
			header: 'Province',
			enableGlobalSearch: true,
			elements: PROVINCES,
		},
		{
			id: 'population',
			header: 'Population',
			render: ({ item }) => formatNumber(item.population),
		},
		{
			id: 'km_2',
			header: 'Area (km²)',
			render: ({ item }) => formatNumber(item.km_2),
		}
	];

	const onChangeView = (view) => {
		const { data: newData, paginationInfo: newPaginationInfo } = filterSortAndPaginate(COUNCILS, view, fields);
		setView(view);
		setData(newData);
		setPaginationInfo(newPaginationInfo);
	}

	return (
		<DataViews
			data={data}
			fields={fields}
			view={view}
			onChangeView={onChangeView}
			paginationInfo={paginationInfo}
		/>
	);
}

export default App;
