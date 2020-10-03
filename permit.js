
const ethers = require('ethers')
const UniswapLPTABI = require('./abi/UniswapLPT')

const mnemonic = 'gallery cinnamon equal inform lend perfect kitchen grab today width eager thank'
const infuraKey = 'a4dcdfe968254cd4a2a30381e3558541'

const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraKey}`);
const wallet = new ethers.Wallet.fromMnemonic(mnemonic)
const walletSigner = new ethers.Wallet(wallet.privateKey, provider)

const getNonce = async (poolTokenAddress, signer) => {
    const userAddress = await signer.getAddress()
    const abi = ['function nonces(address) view returns (uint256)']
    const PoolTokenContract = new ethers.Contract(poolTokenAddress, abi, signer)
    try {
      const nonce = await PoolTokenContract.nonces(userAddress)
      return parseInt(nonce)
    } catch (error) {
      console.log(error)
    }}

const getEIP712Signature = (
    verifyingContract, // Address of the Pool Token
    spender,    // Address of the LLC 
    userAddress,
    amount, // amount needs to be approved
    nonce, // nonce received from nonces() function
    deadline // future value
  ) => {
    const Permit = [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
      },
      {
        name: 'nonce',
        type: 'uint256',
      },
      {
        name: 'deadline',
        type: 'uint256',
      },
    ]
    const EIP712Domain = [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
      },
    ]
    const message = {
      owner: userAddress,
      spender,
      value: amount,
      nonce,
      deadline,
    }
    const domain = {
      name: 'Uniswap V2',
      version: '1',
      chainId: parseInt(42), // replace it with chainId
      verifyingContract,
    }
    const data = JSON.stringify({
      types: {
        Permit,
        EIP712Domain,
      },
      primaryType: 'Permit',
      domain,
      message,
    })
  
    return data
    // this.relaySig(nonce, sig)
  }


const generateSignature = async() =>{
    const nonce = await getNonce('0x266480906fd0aa3edd7ff64f466ea9684b792179', walletSigner)
    const verifyingContract = '0x266480906fd0aa3edd7ff64f466ea9684b792179' // LPT Address
    const spender = '0x87c358D85B84Bf1448DB1a1285c597dD9c350eBa' // LLC Address
    const deadline = + new Date() + 50000
    const userAddress = walletSigner.getAddress()
    const signature = await getEIP712Signature(verifyingContract, spender, userAddress, 100, deadline)
    console.log(signature)
}

generateSignature()