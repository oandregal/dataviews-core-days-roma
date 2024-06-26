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
		/* TODO: SET UP LAYOUTS */
	};
	const [view, setView] = useState({
		/* TODO: SET UP VIEW */
	});

	const fields = [
		/* TODO: SET UP FIELDS */
	];

	// DATASOURCE: set up and query.
	const { data: initialData, paginationInfo: initialPaginationInfo } = filterSortAndPaginate(PHOTOS, view, fields);

	const [data, setData] = useState(initialData);
	const [paginationInfo, setPaginationInfo] = useState(initialPaginationInfo);

	const onChangeView = (view) => {
		/* TODO: REACT TO USER CHANGES */
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
