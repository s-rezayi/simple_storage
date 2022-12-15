const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying ...")
    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)
    console.log(`Contract Address: ${contract.address}`)

    // const nonce = wallet.getTransactionCount();

    // tx = {
    //   nonce: nonce,
    //   gasPrice: 20000000000,
    //   gasLimit: 1000000,
    //   to: null,
    //   value: 0,
    //   data: "",
    //   chainId: 1337,
    // };
    // const sendTxResponce = await wallet.sendTransaction(tx);
    // await sendTxResponce.wait(1);
    // console.log(sendTxResponce);

    // Get number
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`)
    const txResponce = await contract.store("7")
    const txReceipt = await txResponce.wait(1)
    const updatedNumber = await contract.retrieve()
    console.log(`Updated Favorite Number: ${updatedNumber.toString()}`)
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

runMain()
