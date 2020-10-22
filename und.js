const ethers = require('ethers');
const web3 = require('web3');

const UnboundDollarsABI = require('./abi/UnboundDai');
const UnboundLLCABI = require('./abi/UnboundLLCABI');
const UniswapRouterABI = require('./abi/UniswapRouter');

const mnemonic = 'gallery cinnamon equal inform lend perfect kitchen grab today width eager thank';
const infuraKey = 'a4dcdfe968254cd4a2a30381e3558541';

const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraKey}`);
const wallet = new ethers.Wallet.fromMnemonic(mnemonic);
const signer = new ethers.Wallet(wallet.privateKey, provider);
console.log(signer.address);

// change all the addresses
config = {
  unboundDollarsAddress: '0xc266314a87744E94E6F2FC1130d6C5E43FaB0E75',
  DAIUNDLLC: '0x06a1Ae5e8eD0476B2E4E50F2dc4e9277C712cF00',
  daiAddress: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
  uniswapRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  loanRate: 0.5,
};

// Unbound Dollars Address
const UnboundDollars = new ethers.Contract(config.unboundDollarsAddress, UnboundDollarsABI, signer);

// UND-DAI LLC
const LLCContract = new ethers.Contract(config.DAIUNDLLC, UnboundLLCABI, signer);

// UND-DAI Uniswap Pair
const UniswapRouter = new ethers.Contract(config.uniswapRouter, UniswapRouterABI, signer);

async function adjust() {
  try {
    const totalSupply = parseInt(await UnboundDollars.totalSupply());

    const path = [config.daiAddress, config.unboundDollarsAddress];
    const amountOut = await UniswapRouter.getAmountsOut(web3.utils.toWei('1', 'ether'), path);

    const priceOfUnd = amountOut[0];
    console.log(priceOfUnd);
    const targetPriceOfUnd = 1;

    const adjustedTotalSupply = (totalSupply * priceOfUnd) / targetPriceOfUnd;

    if (adjustedTotalSupply > totalSupply) {
      const mintAmount = adjustedTotalSupply - totalSupply;
      console.log(mintAmount);
      // await LLCContract.unlockLPT(mintAmount / config.loanRate, config.unboundDollarsAddress);
    } else if (adjustedTotalSupply < totalSupply) {
      const burnAmount = totalSupply - adjustedTotalSupply;
      console.log(burnAmount);
      // await LLCContract.lockLPT(burnAmount / config.loanRate, config.unboundDollarsAddress);
    }
  } catch (error) {
    console.log(error);
  }
}

adjust();

async function approve() {
  const totalSupply = await UnboundDollars.totalSupply();
  try {
    const approve = UnboundDollars.approve(DAIUNDLLC, totalSupply);
    console.log(approve);
    return approve;
  } catch (error) {
    console.log(error);
  }
}

async function mint(LPTamt) {
  try {
    const mintTx = await LLCContract.lockLPT(LPTamt, config.unboundDollarsAddress);
    console.log(mintTx);
    return mintTx;
  } catch (error) {
    console.log(error);
  }
}

async function short(amountIn) {
  // short UND when the price is less than 1 USD
  // supply more UND by locking UND-DAI LPT's and buy DAI
  try {
    const path = [unboundDollarsAddress, daiAddress];
    const amountOutMin = await UniswapRouter.getAmountsOut(path);

    // Unbound Admin Address
    const to = '0x2aD458F069A6D456690de46Acfa27EFA26748dA8';
    const deadline = +new Date() + 10000;

    // perform a swap
    const swap = await UniswapRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
    console.log(swap);
    return swap;
  } catch (error) {
    console.log(error);
  }
}

async function long(LPTamt) {
  // short UND when the price is more than 1 USD
  // buy UND
  try {
    const path = [daiAddress, unboundDollarsAddress];
    const amountOutMin = await UniswapRouter.getAmountsOut(path);

    // Unbound Admin Address
    const to = '0x2aD458F069A6D456690de46Acfa27EFA26748dA8';
    const deadline = +new Date() + 10000;

    // perform a swap
    const swap = await UniswapRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
    console.log(swap);
    return swap;
  } catch (error) {
    console.log(error);
  }
}
