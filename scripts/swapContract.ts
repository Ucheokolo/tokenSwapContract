import { ethers } from "hardhat";

async function main() {
    // Token Contracts
    const daiToken = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const uniToken = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
    const usdcToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const linkToken = "0x514910771AF9Ca656af840dff83E8264EcF986CA";

    //get contract and deploy
    const ucheSwap = await ethers.getContractFactory("swapContract");
    const UcheSwap = await ucheSwap.deploy();
    await UcheSwap.deployed();

    console.log(`UcheSwap is deployed to ${UcheSwap.address}`);
    // console.log(******** contract successfully deployed *******);



    // impersonate account
    const helpers = require("@nomicfoundation/hardhat-network-helpers");
    const tokenHolder1 = "0x864894Af6B4A911F4d34C2E5aeAADfe2B012c15D";
    await helpers.impersonateAccount(tokenHolder1);
    const impersonatedSigner = await ethers.getSigner(tokenHolder1);



    // interact with impersonator account.
    const daiContract = await ethers.getContractAt("iToken", daiToken)
    const daiBal = await daiContract.balanceOf(tokenHolder1)
    console.log(`${daiBal}`);
    console.log(`******* impersonator account testing passed ******`);

    // interact with chailink oracle
    const linkRate = await UcheSwap.connect(impersonatedSigner).getLinkPrice();
    console.log(`${linkRate}`);
    console.log(`****** Connection to ChainLink Oracle price feed Successful ******`);

    // give approval
    const uniContract = await ethers.getContractAt("iToken", uniToken);
    const uniBal = await uniContract.balanceOf(tokenHolder1);
    console.log(`bal is ${uniBal}`);
    await uniContract.connect(impersonatedSigner).approve(UcheSwap.address, 1000);
    console.log(`done`);


    // Add Liquidity

    // await UcheSwap.connect(impersonatedSigner).addLiquidity(uniToken, 800);
    // const UcheSwapUniBal = await uniContract.balanceOf(UcheSwap.address)
    // console.log(`${UcheSwapUniBal}`);

    // const UcheSwapBal = await uniContract.balanceOf(UcheSwap.address);
    // console.log(`${UcheSwapBal}`);









}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
