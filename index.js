const ethers = require('ethers')
const config = require('./config')

const UnboundDaiABI = require('./abi/UnboundDai')

const mnemonic = 'gallery cinnamon equal inform lend perfect kitchen grab today width eager thank'
const infuraKey = 'a4dcdfe968254cd4a2a30381e3558541'

const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraKey}`);
const wallet =  new ethers.Wallet.fromMnemonic(mnemonic)
const signer = new ethers.Wallet(wallet.privateKey, provider)

async function changeValuator(){
    const unboundDaiContract = new ethers.Contract(config.contracts.unboundDai, UnboundDaiABI, signer)
    const changeValuator = await unboundDaiContract.changeValuator('0x6f0B90B7D6CB0BFca427475F18C34d30EE99fC14')
    console.log(changeValuator)
}

changeValuator()