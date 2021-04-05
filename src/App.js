import { useEffect, useRef } from "react";
import getWeb3 from "./getWeb3";
import colorJson from "./contracts/Color.json"


function App() {
  const web3 = useRef();
  const accounts = useRef();
  const connectedAccountRef = useRef();
  const colorInstance = useRef();
  const inputTokenRef = useRef();
  const collectionRef = useRef();
  const transferIdRef = useRef();
  const transferToRef = useRef();

  useEffect(()=>{
    try {
      (async () =>{
        web3.current = await getWeb3();
        const networkId = await web3.current.eth.net.getId();
        accounts.current = await web3.current.eth.getAccounts();
        connectedAccountRef.current.innerHTML = `Account: ${accounts.current[0]}`
        
        colorInstance.current = new web3.current.eth.Contract(
          colorJson.abi,
          colorJson.networks[networkId] && colorJson.networks[networkId].address
        );
        contractEventListener()

      })() 
    } catch (err) {
      console.log(err)
    }
  },[])

  async function contractEventListener(){
    colorInstance.current.events.Transfer().on("data", (result)=>{
      if (result.returnValues.to === accounts.current[0]){
        alert(`The new NFT tokenID: \n${result.returnValues.tokenId}`)
      } else if(result.returnValues.from === accounts.current[0]){
        alert(`Your NFT tokenID: \n${result.returnValues.tokenId} has been successfully sent to\n${result.returnValues.to}`)
      }      
    })
  }

  // TODO: add filter invalid color code condition
  function handleIssueToken() {
    const colorCode = inputTokenRef.current.value
    colorInstance.current.methods.awardItem(colorCode).send({from: accounts.current[0]})
    inputTokenRef.current.value = ""
  }

  function appendNewComponent(parent, colorCode ,content){
    let colorDiv = document.createElement("div")
    let textDiv = document.createElement("div")
    textDiv.innerHTML = content
    textDiv.style.cssText = "text-align: center; padding-top: 40px"
    colorDiv.style.cssText = `background-color: ${colorCode}; border-radius: 50px; width: 100px; height: 100px; text-align: center; display: inline-block; border: solid 3px grey`
    colorDiv.appendChild(textDiv)
    parent.current.appendChild(colorDiv)
  }

  async function handleCollection(evt) {
    const type = evt.target && evt.target.attributes.name.value
    let _totalSupply = await colorInstance.current.methods.totalSupply().call()
    switch (type) {
      case "all":
        collectionRef.current.innerHTML = ""
        for (var i = 0; i < _totalSupply; i++) {
          let _colorCode = await colorInstance.current.methods.colors(i).call()
          let colorCodeId = i+1
          await appendNewComponent(collectionRef, _colorCode ,`${_colorCode}<br>ID: ${colorCodeId}`)
        } 
        break;

      case "mine":
        collectionRef.current.innerHTML = ""
        // let _balance = await colorInstance.current.methods.balanceOf(accounts.current[0]).call()
        for (var colorCodeId = 1; colorCodeId <= _totalSupply; colorCodeId++) {
          let _colorCode = await colorInstance.current.methods.idToColor(colorCodeId).call()
          let _owner = await colorInstance.current.methods.ownerOf(colorCodeId).call();
          if (_owner === accounts.current[0]) {
            await appendNewComponent(collectionRef, _colorCode, `${_colorCode}<br>ID: ${colorCodeId}`)
          }
        }        
        break;

      default:
        console.log("Invalid event: App.handleCollection")        
    }
  }


  async function handleTransfer() {
    // TODO: filter id which is not exist
    let tokenId = transferIdRef.current.value;
    let transferTo = transferToRef.current.value;
    // TODO: Add try catch to catch ERROR.
    await colorInstance.current.methods.transfer(accounts.current[0], transferTo, tokenId).send({from: accounts.current[0]});
  }

  return (
    <div className="App">
      <div ref={connectedAccountRef}> Account: N/A </div>
      <h2> Issue new NFT token</h2>
      <input placeholder="color code. ex. #FFFFFF" ref={inputTokenRef}></input>
      <button onClick={handleIssueToken}>Mint</button>
      <div onClick={handleCollection} name="all">All NTFs</div>
      <div onClick={handleCollection} name="mine">My collection</div>
      <h2>Transfer your NFT asset</h2>
      <span>Token ID:</span><input ref={transferIdRef}></input>
      <span>Transfer to:</span><input ref={transferToRef}></input>
      <button onClick={handleTransfer}>Submit</button>
      <hr></hr>
      <div ref={collectionRef}></div>    
    </div>
  );
}

export default App;
