const ethers = require('ethers')
const config = require('./config')

const UnboundDaiABI = require('./abi/UnboundDai')
const UnboundValuatorABI = require('./abi/UnboundValuator')
const UnboundLLCABI = require('./abi/UnboundLLCABI')

const mnemonic = ''
const infuraKey = 'a4dcdfe968254cd4a2a30381e3558541'

const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraKey}`);
const wallet =  new ethers.Wallet.fromMnemonic(mnemonic)
const signer = new ethers.Wallet(wallet.privateKey, provider)

const unboundTokenContract = new ethers.Contract('0xa729D5cA5BcE0d275B69728881f5bB86511EA70B', UnboundDaiABI, signer)
const LLCContract = new ethers.Contract('0x7A95c0193f2D77A2DD5b01A1069CE3Eb59E77017', UnboundLLCABI, signer)
const valuatorContract = new ethers.Contract('0xe8E0458bc6661848160a1b41b27c45A865e0E3B1', UnboundValuatorABI, signer)


async function approve(token, spender, amount){
    const erc20 = new ethers.Contract(token, UnboundDaiABI, signer)
    const approve = await erc20.approve(spender, amount)
    console.log(approve)
}

async function changeValuator(){
    const changeValuator = await unboundTokenContract.changeValuator('0x7A47a9e04E96Dcb876BA6B911cfc33D323BBE9b8')
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
    const changeDevFund = await unboundTokenContract.changeSafuFund('0xDA31A1b2c25e2F6541C53F766d4F5786b894DC51')
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
    const changeLoanRate = await valuatorContract.changeLoanRate("0xb0a2a806ec900bb9fe30bd7f6cadd35d74971542", "950000")
    console.log(changeLoanRate)
}

async function changeFeeRate() {
    const changeLoanRate = await valuatorContract.changeFeeRate("0x7A95c0193f2D77A2DD5b01A1069CE3Eb59E77017", "10000")
    console.log(changeLoanRate)
}

async function setValuingAddress(){
    const setValuingAddress = await LLCContract.setValuingAddress('0x7A47a9e04E96Dcb876BA6B911cfc33D323BBE9b8')
    console.log(setValuingAddress)
}

async function getSafuSharesOfStoredFee(){
    const getSafuSharesOfStoredFee = await unboundTokenContract.safuSharesOfStoredFee()
    console.log(getSafuSharesOfStoredFee.toString())
}


async function getPair(){
    const getPair = await LLCContract.pair()
    console.log(getPair)
}

async function changeSafu(){
    const changeSafu = await unboundTokenContract.changeStaking('0x117cb4870a2d94cdBCeAcE048a1582D6Eb081bD3')
    console.log(changeSafu)
}

async function changeDevFund(){
    const changeSafu = await unboundTokenContract.changeDevFund('0x605a416Ce8B75B6e8872E98F347Ff9Ca00Df045b')
    console.log(changeSafu)
}

async function changeStaking(){
    const changeSafu = await unboundTokenContract.changeStaking('0x117cb4870a2d94cdBCeAcE048a1582D6Eb081bD3')
    console.log(changeSafu)
}

async function changeStakeShare(){
    const changeStakeShare = await unboundTokenContract.changeStakeShare(45)
    console.log(changeStakeShare)
}

async function getShares(){
    const getShares = await unboundTokenContract.stakeShares()
    console.log(getShares.toString())
}

async function changeSafuShare(){
    const changeShare = await unboundTokenContract.changeSafuShare(75)
    console.log(changeShare)
}

async function distributeFee(){
    const distributeFee = await unboundTokenContract.distributeFee()
    console.log(distributeFee)
}

async function lockLPTWithPermit() {
    const LPTAmt = "1000000000000000000"
    const deadline = "1604335408061"
    const v = "28"
    const r = "0xc5502b10315a0d8d69d2b4ca58364905147d749ad88cc6226b5f7190e0562246"
    const s = "0x61378b0483ccc38113c8bc7b488d1b9aa885ec896fe7f71144839a93b3314512"
    const minTokenAmt = "11760000000000000000"
    const llc = await LLCContract.lockLPTWithPermit(LPTAmt, deadline, v, r ,s, minTokenAmt, {
        gasLimit: 10000000
    })
    console.log(llc)
}

async function testUNDBurn() {
    const user = "0x6b971f3a6A734a1aC7D717245eb52F6d3b919141"
    const llc = "0x7A95c0193f2D77A2DD5b01A1069CE3Eb59E77017"
    
    const userLoaned = await unboundTokenContract.checkLoan(user, llc)
    const totalLocked = await LLCContract.tokensLocked(user)
    console.log({
        loaned: userLoaned.toString(),
        total: totalLocked.toString()
    })
    const toBurnAmt = parseInt(userLoaned) * 5590580634486403000 / parseInt(totalLocked)
    console.log("totalBurned", toBurnAmt.toString())
}


async function getFeesAddresses(){
    const safu = await unboundTokenContract.safuAddr()
    const devfund = await unboundTokenContract.devFundAddr()

    console.log({
        safu,
        devfund
    })
}


addLLC("0xEbaA212a9D645b1fd37015d6c3d5d94954732C32", 300000, 6000)

// getFeesAddresses()

// addLLC("0x9ce2176fb86B99Ada79355677aBce02C479004B5", )
// getLLC("0x7A95c0193f2D77A2DD5b01A1069CE3Eb59E77017")
// getLLC("0x4c7fbE208615FcaF572eCC9509217C6dF52243fc")

// addLLC("0xE6a9A470EBDe0e49842a4A061aCF291B5bC6Ce4C", "400000","6000")

// getLLC('0x1284f9427fcB96d5BBaE217573BEB658F7fC58D7')
// allowToken('0x96AE296471296B29694881815E15F33b9200C7f2')

// changeValuator()

// changeFeeRate()

// changeStaking()

// changeLoanRate()

// changeFeeRate()
// getPair()

// setValuingAddress()

// lockLPTWithPermit()
// allowToken("0x5eC9BC937af5A348852A3C27031eF0e1DB50AE5C")

// changeLoanRate()

// getShares()
// getSafuSharesOfStoredFee()
// changeStakeShare()
// changeSafuShare()
// distributeFee()
// changeLoanRate()


// approve('0x6dc553B12F84e8a0a6CBaf0617f678E2F6417264', '0xFd119D544AaF3106937979C00238D5eC40F699e3', "5000000000000000000000000")

