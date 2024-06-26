import { useState } from 'react';
import { DataViews, filterSortAndPaginate } from '@wordpress/dataviews';
import {
	Button,
	__experimentalText as Text,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { external, trash } from '@wordpress/icons';

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
	const [allRecords, setAllRecords] = useState(PHOTOS);
	const { data: initialData, paginationInfo: initialPaginationInfo } = filterSortAndPaginate(allRecords, view, fields);

	const [data, setData] = useState(initialData);
	const [paginationInfo, setPaginationInfo] = useState(initialPaginationInfo);

	const onChangeView = (view) => {
		// DATASOURCE: query based on new view state.
		const { data: newData, paginationInfo: newPaginationInfo } = filterSortAndPaginate(allRecords, view, fields);

		setView(view);
		setData(newData);
		setPaginationInfo(newPaginationInfo);
	};

	const actions = [
		{
			id: 'open-original',
			label: 'Open original',
			icon: external,
			callback(items) {
				window.open(items[0].urls.raw, '_blank');
			},
		},
		{
			id: 'delete',
			label: 'Delete item',
			isPrimary: true,
			isDestructive: true,
			supportsBulk: true,
			icon: trash,
			hideModalHeader: true,
			RenderModal: ({ items, closeModal }) => {
				const onDeleteItems = (event) => {
					event.preventDefault();

					closeModal();

					// DATASOURCE: simulate deletion.
					const newRecords = allRecords.filter(record => !items.some(item => item.id === record.id));
					const { data: newData, paginationInfo: newPaginationInfo } = filterSortAndPaginate(newRecords, view, fields);
					setAllRecords(newRecords);

					setData(newData);
					setPaginationInfo(newPaginationInfo);
				};

				return (
					<form onSubmit={onDeleteItems}>
						<VStack spacing="5">
							<Text>
								{`Are you sure you want to delete ${items.length} items?`}
							</Text>
							<HStack justify="right">
								<Button
									__next40pxDefaultSize
									variant="tertiary"
									onClick={closeModal}
								>
									Cancel
								</Button>
								<Button
									__next40pxDefaultSize
									variant="primary"
									type="submit"
								>
									Delete
								</Button>
							</HStack>
						</VStack>
					</form>
				);
			},
		}
	];

	return (
		<DataViews
			data={data}
			fields={fields}
			view={view}
			onChangeView={onChangeView}
			defaultLayouts={defaultLayouts}
			paginationInfo={paginationInfo}
			actions={actions}
		/>
	);
}

export default App;
