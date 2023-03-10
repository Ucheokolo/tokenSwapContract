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
    // all tokens holder
    const helpers = require("@nomicfoundation/hardhat-network-helpers");
    const tokenHolder1 = "0x864894Af6B4A911F4d34C2E5aeAADfe2B012c15D";
    await helpers.impersonateAccount(tokenHolder1);
    const impersonatedSigner = await ethers.getSigner(tokenHolder1);

    // daiHolder
    const daiHolder1 = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";
    await helpers.impersonateAccount(daiHolder1);
    const impersonatedSignerDai = await ethers.getSigner(daiHolder1);

    // usdcHolder
    const usdcHolder1 = "0x56178a0d5F301bAf6CF3e1Cd53d9863437345Bf9";
    await helpers.impersonateAccount(usdcHolder1);
    const impersonatedSignerUsdc = await ethers.getSigner(usdcHolder1);




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
    await uniContract.connect(impersonatedSigner).approve(UcheSwap.address, 10000);
    console.log(`**** Approval given by UNI contract to UcheSwap ****`);


    // Add Liquidity

    // Add UNI liquidity
    await UcheSwap.connect(impersonatedSigner).addLiquidity(uniToken, 800);
    const UcheSwapUniBal = await uniContract.balanceOf(UcheSwap.address)
    console.log(`UNI liquidity is ${UcheSwapUniBal}`);

    // get link contract, give approval and add liquidity
    const linkContract = await ethers.getContractAt("iToken", linkToken);
    const linkBal = await linkContract.balanceOf(tokenHolder1);
    console.log(`The link balance for holder1 is ${linkBal}`);
    await linkContract.connect(impersonatedSigner).approve(UcheSwap.address, 2000);
    console.log(`**** Approval given by LINK contract to UcheSwap ****`)

    // add liquidity
    await UcheSwap.connect(impersonatedSigner).addLiquidity(linkToken, 1200);
    const UcheSwapLinkBal = await linkContract.balanceOf(UcheSwap.address);
    console.log(`LINK liquidity is ${UcheSwapLinkBal}`);

    // USDC
    // get contract
    const usdcContract = await ethers.getContractAt("iToken", usdcToken);
    const usdcBal = await usdcContract.balanceOf(tokenHolder1);
    console.log(`The usdc balance for holder1 is ${usdcBal}`);
    // give approval
    await usdcContract.connect(impersonatedSigner).approve(UcheSwap.address, 4000);
    console.log(`**** Approval given by USDC contract to UcheSwap ****`)


    // Swap token
    //bal b4
    const usdcBalB4 = await usdcContract.balanceOf(tokenHolder1);
    console.log(`The usdc balance for holder1 before is ${usdcBalB4}`);

    await UcheSwap.connect(impersonatedSigner).swapToken(usdcToken, linkToken, 100);
    const UcheSwapUsdcBal = await usdcContract.balanceOf(UcheSwap.address);
    console.log(`successfully swapped usdc. swap usdc balance is ${UcheSwapUsdcBal}`);

    // bal After
    const usdcBalAfter = await usdcContract.balanceOf(tokenHolder1);
    console.log(`The usdc balance for holder1 after swap is ${usdcBalAfter}`);













}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
