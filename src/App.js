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
      alert(`The new NFT tokenID: \n${result.returnValues.tokenId}`)
    })
  }

  // TODO: add filter invalid color code condition
  function handleIssueToken() {
    const colorCode = inputTokenRef.current.value
    colorInstance.current.methods.awardItem(colorCode).send({from: accounts.current[0]})
    inputTokenRef.current.value = ""
  }

  function appendNewComponent(parent, content){
    let colorDiv = document.createElement("div")
    let textDiv = document.createElement("div")
    textDiv.innerHTML = content
    textDiv.style.cssText = "text-align: center; padding-top: 40px"
    colorDiv.style.cssText = `background-color: ${content}; border-radius: 50px; width: 100px; height: 100px; text-align: center; display: inline-block; border: solid 3px grey`
    colorDiv.appendChild(textDiv)
    parent.current.appendChild(colorDiv)
  }

  async function handleCollection(evt) {
    const type = evt.target && evt.target.attributes.name.value
    switch (type) {
      case "all":
        collectionRef.current.innerHTML = ""
        let _totalSupply = await colorInstance.current.methods.totalSupply().call()
        for (var i = 0; i < _totalSupply; i++) {
          let _colorCode = await colorInstance.current.methods.colors(i).call()
          await appendNewComponent(collectionRef, _colorCode)
        } 
        break;

      case "mine":
        console.log("myCollection")
        break;

      default:
        console.log("Invalid event: App.handleCollection")        
    }
  }



  return (
    <div className="App">
      <div ref={connectedAccountRef}> Account: N/A </div>
      <h2> Issue new NFT token</h2>
      <input placeholder="color code. ex. #FFFFFF" ref={inputTokenRef}></input>
      <button onClick={handleIssueToken}>Mint</button>
      <div onClick={handleCollection} name="all">All NTFs</div>
      <hr></hr>
      <div ref={collectionRef}></div>
    </div>
  );
}

export default App;
