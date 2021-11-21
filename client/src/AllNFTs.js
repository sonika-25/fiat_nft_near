import React from 'react';
import axios from 'axios';
import {getPrice, getWeb3,getContracts} from "./utils.js";
import { Link } from 'react-router-dom';
import './styles/cards.css'
import './styles/grid.css'
import './styles/nav.css'
import Thumbnail from './Thumbnail.js'
import { withRouter } from 'react-router-dom'

class AllNFTs extends React.Component {
	constructor(props) {
		super(props)
}
	state = {
		nfts: [],
		web3: undefined,
		accounts:[],
		contracts: undefined,
		price: 0,
		numItems:[],
		itemStructs: []
	}

	componentWillMount() {
		const init = async () => {
			let web3 = await getWeb3();
			let contracts = await getContracts(web3);
			let accounts = await web3.eth.getAccounts();
			let price = await getPrice();
			const notAp = "https://media.npr.org/assets/img/2021/03/05/nyancat-still-6cda3c8e01b3b5db14f6db31ce262161985fb564-s1100-c50.png";
			const auctionPrice = 20;
			let currTokenId;
			let listingPrice = await contracts.stripeMarket.methods.getListingPrice().call({from: accounts[0]});
			listingPrice = listingPrice.toString()
			let priceT ;
			let priceOne =await price.priceFeed.methods.latestRoundData().call()
					.then((roundData) => {
							// Do something with roundData
							let nPrice = Number(roundData.answer)/100000000
							priceT= nPrice;
					});
			//await contracts.nft.methods.createToken("https://www.bbvaopenmind.com/wp-content/uploads/2015/12/Ada_Lovelace_Chalon_portrait-1-1024x1024-1.jpg").send({from:accounts[0]})
			//.then (data => {
			//	currTokenId = data.events.Transfer.returnValues.tokenId
			//})
			//await contracts.stripeMarket.methods.createItem(contracts.nft._address, currTokenId, auctionPrice, "Ada Lovelace").send({from:accounts[0], value: listingPrice })
			let numTokens = await contracts.stripeMarket.methods.getItemId().call({from:accounts[0]});
			await contracts.stripeMarket.methods.fetchItemsCreated().call({from: accounts[0]})
			.then(data=>console.log(data))

			let numItems=[]
			let stars =[];
			//console.log(contracts.stripeMarket);
			for (let i =0; i<numTokens; i++){
				const mItem = await contracts.stripeMarket.methods.idToMarketItem(i+1).call({from: accounts[0]});
				let cup = await mItem.tokenUri;
				if (cup !== notAp){
					let pr = (Number(mItem.price)*priceT)+2;
					mItem.price = pr.toFixed(2).toString()
					stars.push(mItem);
					const tId = await mItem.tokenId
					const po = await contracts.nft.methods.tokenURI(tId).call({from: accounts[0]});
					numItems.push(po)
			}
			}

			await this.setState({
				web3: web3,
				contracts: contracts,
				accounts: accounts,
				numItems: numItems,
				itemStructs: stars,
				price: price
			})
		}
		init();
	}


	render() {
		return (
			<>
			<nav>
				<Link to="/" className="logo"> </Link>
				<div className="profile">
				<a href="http://localhost:3000/mint" className="button">
					<span>Mint NFT</span>
				</a>

					<a href="http://localhost:3000/account" className="button">
						<span>View Owned NFTs</span>
					</a>
				</div>
			</nav>
					<div className="grid four large">
						{// List of thumbnails
						this.state.numItems.map((item,index) => (
							<Thumbnail image_id = {item} image_name= {this.state.itemStructs[index].name} image_price= {this.state.itemStructs[index].price} image_itemId ={this.state.itemStructs[index].itemId} image_status= {this.state.itemStructs[index].sold}/>
						))}
					</div>

			</>
		)

	}

}

export default withRouter(AllNFTs)
