import { useState } from 'react';
import { DataViews, DataForm, filterSortAndPaginate } from '@wordpress/dataviews';
import {
	Button,
	__experimentalText as Text,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { edit, external, trash } from '@wordpress/icons';

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
	const form = {
		type: 'regular',
		fields: ['alt_description', 'ratings']
	};

	const fields = [
		{
			id: 'id',
			label: 'ID',
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
			type: 'text',
			label: 'Description',
			enableGlobalSearch: true,
		},
		{
			id: 'user',
			label: 'By',
			getValue: ({ item }) => item.user.first_name + ' ' + item.user.last_name,
			render: ({ item }) => <a target="_blank" rel="noreferrer" href={item.user.url}>{item.user.first_name + ' ' + item.user.last_name}</a>,
		},
		{
			id: 'ratings',
			type: 'integer',
			label: 'Reviews',
			enableSorting: true,
			render: ({ item }) => `${item.ratings} reviews`,
		},
		{
			id: 'quality',
			label: 'Quality',
			enableSorting: true,
			render: ({ item }) => '★'.repeat(item.quality)
		}
	];

	const { data: initialData, paginationInfo: initialPaginationInfo } = filterSortAndPaginate(PHOTOS, view, fields);
	const [data, setData] = useState(initialData);
	const [paginationInfo, setPaginationInfo] = useState(initialPaginationInfo);

	const onChangeView = (view) => {
		const { data: newData, paginationInfo: newPaginationInfo } = filterSortAndPaginate(PHOTOS, view, fields);
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
			supportsBulk: true,
			icon: trash,
			hideModalHeader: true,
			RenderModal: ({ items, closeModal }) => {
				const onDeleteItems = (event) => {
					event.preventDefault();

					closeModal();
					setData(oldData => oldData.filter(record => !items.includes(record)));
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
		},
		{
			id: 'edit',
			label: 'Edit item',
			icon: edit,
			RenderModal: ({ items, closeModal }) => {
				const [ editedItem, setEditedItem ] = useState(items[0]);
				const onSaveItem = ( event ) => {
					event.preventDefault();

					closeModal();
					setData( oldData => {
						const index = oldData.findIndex( record => record.id === editedItem.id );
						return oldData.with( index, editedItem );
					});
				};
				const onChangeEditedItem = ( edits ) => setEditedItem( {...editedItem, ...edits } );

				return (
					<form onSubmit={onSaveItem}>
					<VStack spacing="5">
						<DataForm data={editedItem} fields={fields} form={form} onChange={onChangeEditedItem} />
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
								Update
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
