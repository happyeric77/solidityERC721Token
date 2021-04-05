
const Color = artifacts.require("Color.sol")
const path = require("path");
const expect = require("./setupTest")

const dotenv = require('dotenv');
result = dotenv.config({ path: "./.env" });
if (result.error) {
    console.log("Fail to load .env varilable in uni test section")
    throw result.error
}

const BN = web3.utils.BN

contract ("My contract test", accounts=>{
    let colorInstance;

    before(async () => {
        colorInstance = await Color.deployed()
    });

    it("Should be able to have contract address", async ()=>{   
        console.log(colorInstance.address)     
        expect(colorInstance.address).to.not.equal("")
        expect(colorInstance.address).to.not.equal(0x0)
        expect(colorInstance.address).to.not.equal(null)
        expect(colorInstance.address).to.not.equal(undefined)
    });

    it("Should have Token name and symbol", async ()=>{
        const name = await colorInstance.name()
        const symbol = await colorInstance.symbol()
        expect(name).to.not.equal("")
        expect(name).to.not.equal(0x0)
        expect(name).to.not.equal(null)
        expect(name).to.not.equal(undefined)
        expect(symbol).to.not.equal("")
        expect(symbol).to.not.equal(0x0)
        expect(symbol).to.not.equal(null)
        expect(symbol).to.not.equal(undefined)
    });

    it("Is able to add new item", async () => {
        const color = await colorInstance.awardItem("#EC0581")
        const totalSupply = await colorInstance.totalSupply()
        expect(totalSupply).to.be.a.bignumber.equal(new BN(1))
        const event = await color.logs[0].args
        expect(event.from).equal('0x0000000000000000000000000000000000000000')
        expect(event.to).equal(accounts[0])
    });

    it("Is not able to mint the same item twice", () => {
        return expect(colorInstance.awardItem("#EC0581")).to.be.rejected;
    });

    it("Is able to add multiple items", async() =>{
        await colorInstance.awardItem("#FFFFFF")
        await colorInstance.awardItem("#000000")
        const expectedColors = ["#EC0581","#FFFFFF","#000000"]        
        const totalSupply = await colorInstance.totalSupply()
        for (i=0; i < totalSupply; i++ ) {
            let color = await colorInstance.colors(i)
            expect(color).equal(expectedColors[i])
        }
    });
})