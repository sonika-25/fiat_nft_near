import React, {useEffect, useState} from 'react';
import {getWeb3,getContracts} from "./utils.js"
import Thumbnail from './Thumbnail.js'
function App (){
  const [web3,setWeb3]= useState(undefined)
  const [accounts,setAccounts]= useState([])
  const [contracts,setContracts]= useState(undefined);
  const [numItems, setNumItems] = useState([]);
  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const contracts = await getContracts(web3);
      const accounts = await web3.eth.getAccounts();
      const numTokens = await contracts.stripeMarket.methods.getItemId().call({from:accounts[0]});
      const numItems=[]
      for (let i =0; i<numTokens; i++){
        const mItem = await contracts.stripeMarket.methods.idToMarketItem(i+1).call({from: accounts[0]});
        const tId = await mItem.tokenId
        const po = await contracts.nft.methods.tokenURI(tId).call({from: accounts[0]});
        numItems.push(po)
      }
      setWeb3(web3);
      setContracts(contracts);
      setAccounts(accounts);
      setNumItems(numItems);
    }
    init();
  }, [])
console.log(numItems);
let imageArr=[];
let currTokenId ;
const auctionPrice = 1000000000000
let listingPrice;
let uriexp;
const createToken=async()=>{
  console.log('Create Item');
  await contracts.nft.methods.createToken("https://image.shutterstock.com/image-photo/red-apple-isolated-on-white-260nw-1727544364.jpg").send({from: accounts[0]})
  .then(data=>{
    currTokenId = (data.events.Transfer.returnValues.tokenId)
  })
  }
  const createItem=async()=>{
    listingPrice = await contracts.stripeMarket.methods.getListingPrice().call({from: accounts[0]});
    listingPrice = listingPrice.toString()
    const item = await contracts.stripeMarket.methods.createItem(contracts.nft._address,currTokenId, auctionPrice).send({from: accounts[0], value: listingPrice});
    console.log(item);
  }

  const createSale= async()=>{
    console.log(currTokenId);
    const sale = await contracts.stripeMarket.methods.createMarketSale(contracts.nft._address,1).send({from: accounts[0], value: auctionPrice});
    console.log(sale);
    console.log(await contracts.stripeMarket.methods.idToMarketItem(1).tokenId);

  }

  const getItems = async() =>{
    imageArr=[];
    let po = await contracts.stripeMarket.methods.getItemId().call({from:accounts[0]});
    //let cho = await contracts.nft.methods.tokenURI(3).call({from:accounts[0]});
    let seearr =[];
    for (let i =0;i<po;i++){
      let see = await contracts.stripeMarket.methods.idToMarketItem(i+1).call({from: accounts[0]});
      let uri = await contracts.nft.methods.tokenURI(see.tokenId).call({from:accounts[0]});
      seearr.push(uri);
      imageArr.push(uri)
    }
    console.log(imageArr);
    //uriexp = seearr[0];
    //document.getElementById("imageNft").src = seearr[0];
    const poe =[];
      numItems.map((num, index) => {
        poe.push(<img src={num[index]} id='imageNft' height='200'/>)
      })
    return ( poe )
  }
  if((web3)===undefined || (accounts) === [] || (numItems) === [] ||  (contracts) === undefined ){
    return <div> Loading... </div>
  }
      return (
        <>
        <div>
        <button onClick={createToken}> CREATE TOKEN </button>
        <button onClick={createItem}> PUT IN MARKET </button>
        <button onClick={createSale}> SELL TOKEN </button>
        <button onClick={getItems}> GET ITEMS</button>
        {
          [1,2,3].map((num, index) => {
            <Thumbnail image_id={"https://image.shutterstock.com/image-photo/red-apple-isolated-on-white-260nw-1727544364.jpg"} />
          })
        }
        {accounts}
        Heelo
        <Thumbnail image_id={"https://image.shutterstock.com/image-photo/red-apple-isolated-on-white-260nw-1727544364.jpg"} />

        </div>
        </>
      )

}
export default App;
