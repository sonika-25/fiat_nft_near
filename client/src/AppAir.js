import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Houses from './Houses'
import House from './House'
import MintToken from './MintToken'
import ViewNfts from './ViewNfts'

class AppAir extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route path="/account" component={ViewNfts} />
					<Route path="/mint" component={MintToken} />

					<Route path="/:id" component={House} />
					<Route path="/" component={Houses} />

				</Switch>
			</BrowserRouter>
		)
	}
}

export default AppAir;
