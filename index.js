const ethers = require('ethers')
const config = require('./config')

const UnboundDaiABI = require('./abi/UnboundDai')
const UnboundValuatorABI = require('./abi/UnboundValuator')

const mnemonic = 'gallery cinnamon equal inform lend perfect kitchen grab today width eager thank'
const infuraKey = 'a4dcdfe968254cd4a2a30381e3558541'

const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraKey}`);
const wallet =  new ethers.Wallet.fromMnemonic(mnemonic)
const signer = new ethers.Wallet(wallet.privateKey, provider)

const unboundTokenContract = new ethers.Contract('0xc266314a87744E94E6F2FC1130d6C5E43FaB0E75', UnboundDaiABI, signer)
const LLCContract = new ethers.Contract('0x06a1Ae5e8eD0476B2E4E50F2dc4e9277C712cF00', UnboundDaiABI, signer)
const valuatorContract = new ethers.Contract('0x9fC541FCC54Ded46CD69a112d0f27584fb081e45', UnboundValuatorABI, signer)


async function changeValuator(){
    const changeValuator = await unboundTokenContract.changeValuator('0x9fC541FCC54Ded46CD69a112d0f27584fb081e45')
    console.log(changeValuator)
}

async function checkLoan(){
    const checkLoan = await unboundTokenContract.checkLoan('0x2aD458F069A6D456690de46Acfa27EFA26748dA8')
    console.log(checkLoan.toString())
}

async function changeDevFund(){
    const changeDevFund = await unboundTokenContract.changeDevFund('0xeA6439DdaB48bF67e8e067b124Cf16d5bFBA8CDB')
    console.log(changeDevFund)
}

async function changeSafuFund(){
    const changeDevFund = await unboundTokenContract.changeSafuFund('0xcc729a114aa8f572971d4d85B21e661E265Df20C')
    console.log(changeDevFund)
}

async function balanceOf(){
    const balanceOf = await unboundTokenContract.balanceOf('0x464499A3D0a578448f4F4B6e223A97497cFDB8d6')
    console.log(balanceOf.toString())
}

async function addLLC(LLC, loanRate, feeRate) {
    const addLLC = await valuatorContract.addLLC(LLC, loanRate, feeRate)
    console.log(addLLC)
}

async function getLLC(LLC) {
    const getLLC = await valuatorContract.getLLCStruct(LLC)
    console.log(getLLC.toString())
}

async function allowToken(uTokenAddress) {
    // add new uToken to Valuator
    const allowToken = await valuatorContract.allowToken(uTokenAddress)
    console.log(allowToken)
}

async function changeLoanRate() {
    const changeLoanRate = await valuatorContract.changeLoanRate("0x06a1Ae5e8eD0476B2E4E50F2dc4e9277C712cF00", "500000")
    console.log(changeLoanRate)
}

async function changeFeeRate() {
    const changeLoanRate = await valuatorContract.changeFeeRate("0xBCad91504416c968fD1b0ed2E10e3bC91E65af8c", "500")
    console.log(changeLoanRate)
}

// getLLC("0x06a1Ae5e8eD0476B2E4E50F2dc4e9277C712cF00")
// getLLC("0x4c7fbE208615FcaF572eCC9509217C6dF52243fc")

// addLLC("0x507a50C534e4aB0E4edE9a87DCe21d00A6a382Fb", "500000","5000")

getLLC('0x507a50C534e4aB0E4edE9a87DCe21d00A6a382Fb')
// allowToken('0xc266314a87744E94E6F2FC1130d6C5E43FaB0E75')
// changeValuator()

// changeFeeRate()

// changeLoanRate()

changeFeeRate()