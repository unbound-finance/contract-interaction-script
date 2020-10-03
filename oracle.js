const UniswapLPTABI = require('./abi/UniswapLPT')
const MooniswapLPTABI = require('./abi/MooniswapLPT')

const ethers = require('ethers')

const mnemonic = 'gallery cinnamon equal inform lend perfect kitchen grab today width eager thank'
const infuraKey = 'a4dcdfe968254cd4a2a30381e3558541'

const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${infuraKey}`);
const wallet =  new ethers.Wallet.fromMnemonic(mnemonic)
const signer = new ethers.Wallet(wallet.privateKey, provider)

const config = {
    dai: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
    usdc: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
    weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    uniswapRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    uniswap: {
        USDCWETHLPT: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
        DAIETH: '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
    },
    mooniswap: {
        DAIWETH: '0x75116bd1ab4b0065b44e1a4ea9b4180a171406ed'
    }
}

async function getUniswapPrice() {
    const uniswapLPT = new ethers.Contract(config.DAIETH, UniswapLPTABI, signer)
    const getReserves = await uniswapLPT.getReserves()
    const reserve0 = getReserves._reserve0.toString()
    const reserve1 = getReserves._reserve1.toString()
    console.log('Value in DAI', (reserve0/reserve1))
}

function getMooniSwapPrice(){
    const mooniswapLPT = new ethers.Contract(config.DAIWETH, MooniswapLPTABI, signer)
}

function getBancorPrice(){

}

getUniswapPrice()
