import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './styles/cards.css'
import './styles/grid.css'
import './styles/users.css'
import './styles/nav.css'
import './styles/gallery.css'
import './styles/review.css'
import {getPrice, getWeb3,getContracts} from "./utils.js";
import Thumbnail from './Thumbnail.js'
import {Link} from 'react-router-dom'

class ViewNfts extends React.Component {
  constructor(props){
    super(props)
    //this.getNfts = this.getNfts.bind(this);
  }
  state={
    web3: undefined,
    contracts: undefined,
    accounts: [],
    createdNfts: [],
    itemStructs: [],
    price:0

  }

  componentWillMount(){
    const init = async () => {
      let web3 = await getWeb3();
      let contracts = await getContracts(web3);
      let accounts = await web3.eth.getAccounts();
      let numTokens = await contracts.stripeMarket.methods.fetchMyNFTs().call({from:accounts[0]});
      let liss= await contracts.stripeMarket.methods.fetchItemsCreated().call({from: accounts[0]});
      let price = await getPrice();
      let priceOne =await price.priceFeed.methods.latestRoundData().call()
          .then((roundData) => {
              let nPrice = Number(roundData.answer)/100000000
              this.setState({
                price: nPrice.toFixed(3)
              })
          });
      let createdNfts =[]
      for( let  i= 0; i<liss.length; i++){
        if (liss[i].tokenUri !== "https://media.npr.org/assets/img/2021/03/05/nyancat-still-6cda3c8e01b3b5db14f6db31ce262161985fb564-s1100-c50.png"){
          createdNfts.push(liss[i])
        }
      }
      //let stars =[];


      this.setState({
        web3: web3,
        contracts: contracts,
        accounts: accounts,
        createdNfts: createdNfts,
        itemStructs: numTokens
      })
      let rt = await contracts.stripeMarket.methods.fetchItemsCreated().call({from: accounts[0]});
      console.log(rt);
    }
    init();
  }

	render() {
    if (this.state.itemStructs == 0 && this.state.createdNfts ==0 ){
      return (
        <p> No Items Minted or Owned </p>
      )
    }
		return (
  		<>
      <nav>
				<a href="/" className="logo"></a>
				<div className="profile">
				<a href="http://localhost:3000/mint" className="button">
					<span>Mint NFT</span>
				</a>
					<a href="/account" className="button">
						<span>View Owned NFTs</span>
					</a>
				</div>
			</nav>
      <div>
        <p className = "myst">Owned NFTs </p>
					<div className="grid four large">
						{// List of thumbnails
						this.state.itemStructs.map((item,index) => (
							<Thumbnail image_name={this.state.itemStructs[index].name} image_id = {this.state.itemStructs[index].tokenUri} image_price= {this.state.itemStructs[index].price} image_itemId ={this.state.itemStructs[index].itemId} image_status= {this.state.itemStructs[index].sold}/>
						))}
					</div>
          <hr />
          <p className= "myst">Minted NFTs </p>
  					<div className="grid four large">
  						{// List of thumbnails
  						this.state.createdNfts.map((item,index) => (
  							<Thumbnail image_name={this.state.itemStructs[index].name} image_id = {this.state.createdNfts[index].tokenUri} image_price= {(Number(this.state.createdNfts[index].price)*this.state.price)+2} image_itemId ={this.state.createdNfts[index].itemId} image_status= {this.state.createdNfts[index].sold}/>
  						))}
  					</div>
          </div>
      </>
		)
	}
}

export default ViewNfts;
