import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from './Home'
import Dashboard from './dashboard/Dashboard'
import Login from './Login';
import { AuthContext } from '../util/AuthContext'
import ProtectedRoute from './ProtectedRoute';
import Navbar from '../components/core/Navbar';
import Footer from '../components/core/Footer';


function useLocalStorage(key, initialValue) {

	/**********************************************************************
	*
	* This grabs a piece of data from local storage in the browser.
	* It helps the persistences of states.
	*
	* @param key Name of the value being to be queried.
	* @param initialValue value of data being retrieved. (usually null on start up)
	*
	* @return The initial value, usually received by the context state.
	*
	***********************************************************************/
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			//console.log(error);
			return initialValue;
		}
	});

	/**********************************************************************
	*
	* This stores or updates a value in global storage.
	*
	* @param value The value being stored or updated
	*
	* @return A state hook.
	*
	***********************************************************************/
	const setValue = value => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.log(error);
		}
	};
	return [storedValue, setValue];
}

export default function App(props) {

	// User's authentication tokens
	const [accessToken, setAccessToken] = useLocalStorage('accessToken', null);
	const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', null);

	// Global username variable.
	const [username, setUsername] = useLocalStorage('username', "");

	// Flag for viewing protected routes.
	const [isAuthed, setIsAuthed] = useLocalStorage('isAuthed', false);

	// Global search query of bug report comments.
	const [searchQuery, setSearchQuery] = useLocalStorage('searchQuery', "");

	// Global sort values ascending = 1, descending = 2, no sort = 0. 
	const [dateReportedSortValue, setDateReportedSortValue] = useLocalStorage('dateReportedSortValue', 0);
	const [progressSortValue, setProgressSortValue] = useLocalStorage('progressSortValue', 0);

	return (
		<div>
			<div>
				<BrowserRouter>
					<Switch>
						<AuthContext.Provider
							value={{
								accessToken,
								setAccessToken,
								refreshToken,
								setRefreshToken,
								isAuthed,
								setIsAuthed,
								username,
								setUsername,
								searchQuery,
								setSearchQuery,
								dateReportedSortValue,
								setDateReportedSortValue,
								progressSortValue,
								setProgressSortValue
							}}>
							<Navbar />
							<Route exact path="/" component={Home} />
							<ProtectedRoute exact path="/dashboard" component={Dashboard} />
							<Route exact path="/login" component={Login} />
						</AuthContext.Provider>
					</Switch>
				</BrowserRouter>
			</div>
			<Footer />
		</div>
	);
}

