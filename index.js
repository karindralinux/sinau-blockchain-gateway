
// Setup Express
import express from 'express';
import bodyParse from 'body-parser'
import { ethers } from 'ethers';
import TransactionEth from '@ethereumjs/tx';
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import Web3 from 'web3';
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = 3000
app.use(bodyParse.json())

// Setup Provider

const web3 = new Web3(new Web3.providers.HttpProvider(getBaseUrl()))

function getBaseUrl() {
    const sandboxUrl = `https://ropsten.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
    const productionUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;

    if (process.env.IS_SANDBOX) {
        return sandboxUrl
    }

    return productionUrl
}


app.get('/ethereum/height', async (_, res) => {
    try {
      
        const height = await web3.eth.getBlockNumber()

        res.send({ height })
    } catch (error) {
        throw error;
    }
})

app.get('/ethereum/balance', async (req, res) => {
    try {
        const { address } = req.query

        const balance = await web3.eth.getBalance(address);

        res.send({
            address,
            balance,
        });
    } catch (error) {
        throw error
    }
})

app.get('/ethereum/gas-price', async (req,res) => {
    try {

        const gasPrice = await web3.eth.getGasPrice();

        return res.send({ 
            gasPrice: Number(gasPrice) 
        });

    } catch (error) {
        throw error
    }
})

app.post('/ethereum/address', async (req, res) => {
    try {
        const wallet = ethers.Wallet.createRandom();

        res.status(401).send({
            address : wallet.address,
            privateKey : wallet.privateKey,
            mnemonic : wallet.mnemonic.phrase
        });
    } catch (error) {
        throw error
    }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})