import { useState } from 'react';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews';

// It's important to import the component styles, first.
// Otherwise, styles load in the wrong order
// (for example, z-index for popovers & dataviews modals).
import '@wordpress/components/build-style/style.css';
import '@wordpress/dataviews/build-style/style.css';

import { PHOTOS, TOPICS } from './data';

function App() {
	const defaultLayouts = {
		table: {
			layout: {
				primaryField: 'id',
				combinedFields: [
					{
						id: 'ratings_quality',
						label: 'Ratings',
						children: ['quality', 'ratings'],
						direction: 'vertical',
					}
				]
			},
		},
		grid: {
			layout: {
				primaryField: 'id',
				mediaField: 'img',
				badgeFields: ['topics'],
			},
		}
	};
	const [view, setView] = useState({
		type: 'grid',
		search: '',
		sort: {
			field: 'id',
			direction: 'desc',
		},
		page: 1,
		perPage: 10,
		layout: defaultLayouts.grid.layout,
		fields: ['id', 'img', 'topics', 'alt_description', 'user', 'ratings_quality'],
	});

	const fields = [
		{
			id: 'id',
			label: 'ID',
			type: 'text',
		},
		{
			id: "img",
			label: "Image",
			render: ({ item }) => <img alt={item.alt_description} width="512" src={item.urls.regular} />,
			enableSorting: false,
		},
		{
			id: 'topics',
			label: 'Topics',
			render: ({ item }) => item.topics.join(', '),
			elements: [...TOPICS],
			enableSorting: false,
		},
		{
			id: 'alt_description',
			label: 'Description',
			type: 'text',
			enableGlobalSearch: true,
		},
		{
			id: 'user',
			label: 'By',
			type: 'text',
			getValue: ({ item }) => item.user.first_name + ' ' + item.user.last_name,
			render: ({ item }) => <a target="_blank" rel="noreferrer" href={item.user.url}>{item.user.first_name + ' ' + item.user.last_name}</a>,
		},
		{
			id: 'ratings',
			label: 'Reviews',
			type: 'integer',
			render: ({ item }) => `${item.ratings} reviews`,
		},
		{
			id: 'quality',
			label: 'Quality',
			type: 'integer',
			render: ({ item }) => '★'.repeat(item.quality)
		}
	];

	// DATASOURCE: set up and query.
	const { data: initialData, paginationInfo: initialPaginationInfo } = filterSortAndPaginate(PHOTOS, view, fields);

	const [data, setData] = useState(initialData);
	const [paginationInfo, setPaginationInfo] = useState(initialPaginationInfo);

	const onChangeView = (view) => {
		// DATASOURCE: query based on new view state.
		const { data: newData, paginationInfo: newPaginationInfo } = filterSortAndPaginate(PHOTOS, view, fields);

		setView(view);
		setData(newData);
		setPaginationInfo(newPaginationInfo);
	};

	return (
		<DataViews
			data={data}
			fields={fields}
			view={view}
			onChangeView={onChangeView}
			defaultLayouts={defaultLayouts}
			paginationInfo={paginationInfo}
		/>
	);
}

export default App;
