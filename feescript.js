const axios = require('axios')
const dayjs = require('dayjs')
const ethers = require('ethers')
const UniswapLPTABI = require('./abi/UniswapLPT')

const mnemonic = 'gallery cinnamon equal inform lend perfect kitchen grab today width eager thank'
const infuraKey = 'a4dcdfe968254cd4a2a30381e3558541'

const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${infuraKey}`);
const wallet = new ethers.Wallet.fromMnemonic(mnemonic)
const signer = new ethers.Wallet(wallet.privateKey, provider)

const getPairsData = async (pair, fromDate, uptoDays) => {
    try {
        const getDailyData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
            method: 'post',
            data: {
                query: `
            query {
                pairDayDatas(first: ${uptoDays}, orderBy: date, orderDirection: desc,
                  where: {
                    pairAddress: "${pair}",
                    date_gt: ${fromDate}
                  }
                ) {
                    date
                    dailyVolumeToken0
                    dailyVolumeToken1
                    dailyVolumeUSD
                    reserveUSD
                }
               }
            `
            }
        })
        const dailyData = getDailyData.data.data.pairDayDatas
        let i;
        let totalVolume = 0;
        for (i = 0; i < dailyData.length; i++) {
            const date = dayjs.unix(dailyData[i].date)
            // console.log(date.format(), dailyData[i].dailyVolumeUSD)
            totalVolume += parseFloat(dailyData[i].dailyVolumeUSD)
        }
        console.log('totalFees', totalVolume * 0.3 / 100)
        return totalVolume * 0.3 / 100
        // console.log(`Total Volume in ${dailyData.length} days`, totalVolume)
        // console.log('Total Fees Collected in Last 30 Days', totalVolume * 0.3 / 100)
    } catch (error) {
        console.log(error)
    }
}

// const getNetValue = async (pair, fromDate, uptoDays) => {
//     const totalFees = await getPairsData(pair, fromDate, uptoDays)
//     // const pairContract = new ethers.Contract(pair, UniswapLPTABI, signer)
//     const impermenentLoss =  2.23
//     const liquidiyValue = 200 // provided liquidity value in terms of USD
//     const lossPercentage = 30 // expected loss percentage
//     const poolPercentage = 2 // pool share of the user in percent

//     const fees = parseFloat(totalFees) * poolPercentage/100

//     const netValue = liquidiyValue - (liquidiyValue * lossPercentage)/200 - impermenentLoss/100 + fees
//     console.log('netValue', netValue) 
// }


const getNetValue = async (pair, stablecoinAmt, secondAssetAmount, fromDate, uptoDays, stablecoinPosition, lossPercentage, impermenentLoss) => {

    // get total fees accrued on whole pool
    const totalFees = await getPairsData(pair, fromDate, uptoDays)

    const pairContract = new ethers.Contract(pair, UniswapLPTABI, signer)


    // hardcoding LTV for now
    const LTV = 30 // in percent

    // calculate pool share
    const reserves = await pairContract.getReserves()
    const totalPoolValue = (parseInt(reserves._reserve0) * 2) / 1e18 // get total pool share

    const usersPoolValue = stablecoinAmt * 2
    console.log(usersPoolValue * 30/100)

    const usersPoolShare = (usersPoolValue / totalPoolValue) * 100

    const fees = parseFloat(totalFees) * usersPoolShare / 100

    const impLoss = usersPoolValue * impermenentLoss / 100

    const netPoolValue = usersPoolValue - ((usersPoolValue * lossPercentage) / 200) - impLoss + fees

    console.log({
        'Users Pool Value (in USD)': usersPoolValue,
        'Users Pool Share (in %)': usersPoolShare,
        'Loan to Value Ratio (in %)': LTV,
        'Fees Earned by User': fees,
        'If one asset down by (in %)': lossPercentage,
        'Impermanent Loss': impermenentLoss,
        'Loan Given (in USD)': usersPoolValue * LTV/100,
        'Net Value': netPoolValue,
        'Need to Liquidate?': netPoolValue < usersPoolValue * LTV/100 ? ' 😞 YES' : '😃 NO'
    })

}

getNetValue('0xa478c2975ab1ea89e8196811f51a7b7ade33eb11', '4000000', '10000', 1598918400, 100, 1, 125, 7.69)