const ethers = require('ethers')
const UnboundLLCABI = require('./abi/UnboundLLCABI')

const mnemonic = ''
const infuraKey = 'a4dcdfe968254cd4a2a30381e3558541'

const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraKey}`);
const wallet = new ethers.Wallet.fromMnemonic(mnemonic)
const signer = new ethers.Wallet(wallet.privateKey, provider)

async function changeCR(LLCAddr, CREnd) {
    const LLCContract = new ethers.Contract(LLCAddr, UnboundLLCABI, signer)
    const cr = await LLCContract.setCREnd(CREnd)
    console.log(cr)
}

const LLCAddress = "0xD283CF3d9910C65679c5FF3B3bf06E76842C9952" // replace with the LLC address
const CRRatio = "20000" // replace this with ratio we want to set


// call the change ratio function
changeCR(LLCAddress, CRRatio)