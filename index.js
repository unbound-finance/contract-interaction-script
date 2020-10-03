const ethers = require('ethers')
const config = require('./config')

const UnboundDaiABI = require('./abi/UnboundDai')

const mnemonic = 'gallery cinnamon equal inform lend perfect kitchen grab today width eager thank'
const infuraKey = 'a4dcdfe968254cd4a2a30381e3558541'

const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraKey}`);
const wallet =  new ethers.Wallet.fromMnemonic(mnemonic)
const signer = new ethers.Wallet(wallet.privateKey, provider)

const unboundDaiContract = new ethers.Contract('0x4Fabb145d64652a948d72533023f6E7A623C7C53', UnboundDaiABI, signer)

async function changeValuator(){
    const changeValuator = await unboundDaiContract.changeValuator('0x949B41d34F495F7607E4f58929D10B59A46cA3b7')
    console.log(changeValuator)
}

async function checkLoan(){
    const checkLoan = await unboundDaiContract.checkLoan('0x2aD458F069A6D456690de46Acfa27EFA26748dA8')
    console.log(checkLoan.toString())
}

async function changeDevFund(){
    const changeDevFund = await unboundDaiContract.changeDevFund('0xeA6439DdaB48bF67e8e067b124Cf16d5bFBA8CDB')
    console.log(changeDevFund)
}

async function changeSafuFund(){
    const changeDevFund = await unboundDaiContract.changeSafuFund('0xcc729a114aa8f572971d4d85B21e661E265Df20C')
    console.log(changeDevFund)
}

async function balanceOf(){
    const balanceOf = await unboundDaiContract.balanceOf('0x464499A3D0a578448f4F4B6e223A97497cFDB8d6')
    console.log(balanceOf.toString())
}

balanceOf()