import { ethers } from "hardhat";

async function main() {
    const ucheSwap = await ethers.getContractFactory("swapContract");
    const UcheSwap = await ucheSwap.deploy();
    await UcheSwap.deployed();

    console.log(`UcheSwap is deployed to ${UcheSwap.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
