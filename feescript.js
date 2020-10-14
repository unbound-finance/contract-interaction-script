const axios = require('axios')
const dayjs = require('dayjs')
const ethers = require('ethers')
const UniswapLPTABI = [  {
    "constant": true,
    "inputs": [],
    "name": "getReserves",
    "outputs": [
       {
          "internalType": "uint112",
          "name": "_reserve0",
          "type": "uint112"
       },
       {
          "internalType": "uint112",
          "name": "_reserve1",
          "type": "uint112"
       },
       {
          "internalType": "uint32",
          "name": "_blockTimestampLast",
          "type": "uint32"
       }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }]

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
            totalVolume += parseFloat(dailyData[i].dailyVolumeUSD)
        }
        console.log('totalFees', totalVolume * 0.3 / 100)
        return totalVolume * 0.3 / 100
    } catch (error) {
        console.log(error)
    }
}

const getAverageFees = async() => {
    const today = dayjs()
    const uniswapLaunchDate = 1589846400
    const date = dayjs.unix(uniswapLaunchDate)
    const numberOfDays = today.diff(date, "days")
    const getTotalFees = await getPairsData('0xa478c2975ab1ea89e8196811f51a7b7ade33eb11', uniswapLaunchDate, numberOfDays)
    return getTotalFees/numberOfDays
}



const getNetValue = async (pair, stablecoinAmt, lossPercentage, days) => {

    const pairContract = new ethers.Contract(pair, UniswapLPTABI, signer)
    // calculate pool share
    const reserves = await pairContract.getReserves()
    const totalPoolValue = (parseInt(reserves._reserve0) * 2) / 1e18 // get total pool share

    const usersPoolValue = stablecoinAmt * 2

     // get impermenent loss
    const getImpLoss = await getImpermenentLoss(usersPoolValue, lossPercentage)

    const impLoss = usersPoolValue * getImpLoss / 100

    const averageFees = await getAverageFees()

    // get average fees and multiple
    const totalFees = averageFees * days

    const usersPoolShare = (usersPoolValue / totalPoolValue) * 100

    const fees = parseFloat(totalFees) * usersPoolShare / 100

    const netPoolValue = usersPoolValue + ((usersPoolValue * lossPercentage) / 200) - impLoss + fees

    console.log({
        'Users Pool Value (in USD)': usersPoolValue,
        'Users Pool Share (in %)': usersPoolShare,
        'Fees Earned by User': fees,
        'If one asset down by (in %)': lossPercentage,
        'Impermanent Loss': impLoss,
        'Net Value': netPoolValue,
    })

}

const getImpermenentLoss = async (totalValue, percentage) => {
        const remainingValue = totalValue + percentage
        const priceRatio = (100 + percentage) / 100
        const numerator = Math.sqrt(priceRatio) * 2
        const denominator = 1 + priceRatio
        const impLoss = remainingValue * numerator / denominator;
        return 100 - (impLoss / remainingValue) * 100
}

getNetValue('0xa478c2975ab1ea89e8196811f51a7b7ade33eb11', '200', -50, 30)
