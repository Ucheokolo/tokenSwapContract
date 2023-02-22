// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract swapContract {
    // declare token/usd pair addresses
    AggregatorV3Interface internal linkPriceFeed;
    AggregatorV3Interface internal uniPriceFeed;
    AggregatorV3Interface internal daiPriceFeed;
    AggregatorV3Interface internal usdcPriceFeed;
    IERC20 LINK;
    IERC20 UNI;
    IERC20 DAI;
    IERC20 USDC;
    mapping(address => mapping(IERC20 => uint256)) individualLiquidityPool;
    mapping(IERC20 => uint256) uniqueTokenPool;
    uint256 swapAmountB;
    uint256 swapAmountA;

    constructor() {
        // instantiate pair addresses
        linkPriceFeed = AggregatorV3Interface(
            0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c
        );
        uniPriceFeed = AggregatorV3Interface(
            0x553303d460EE0afB37EdFf9bE42922D8FF63220e
        );
        daiPriceFeed = AggregatorV3Interface(
            0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9
        );
        usdcPriceFeed = AggregatorV3Interface(
            0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6
        );
        LINK = IERC20(0x514910771AF9Ca656af840dff83E8264EcF986CA);
        DAI = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
        USDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
        UNI = IERC20(0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984);
    }

    // Create functions to get latest token/usd rates
    function getLinkPrice() public view returns (int256) {
        (, int256 price, , , ) = linkPriceFeed.latestRoundData();
        return price;
    }

    function getUniPrice() public view returns (int256) {
        (, int256 price, , , ) = uniPriceFeed.latestRoundData();
        return price;
    }

    function getDaiPrice() public view returns (int256) {
        (, int256 price, , , ) = daiPriceFeed.latestRoundData();
        return price;
    }

    function getUsdcPrice() public view returns (int256) {
        (, int256 price, , , ) = usdcPriceFeed.latestRoundData();
        return price;
    }

    function addLiquidity(IERC20 tokenContract, uint256 amount) public {
        IERC20 liquidityToken;
        if (tokenContract == IERC20(LINK)) {
            liquidityToken = IERC20(LINK);
        } else if (tokenContract == IERC20(DAI)) {
            liquidityToken = IERC20(DAI);
        } else if (tokenContract == IERC20(USDC)) {
            liquidityToken = IERC20(USDC);
        } else if (tokenContract == IERC20(UNI)) {
            liquidityToken = IERC20(UNI);
        }
        individualLiquidityPool[msg.sender][liquidityToken] += amount;
        uniqueTokenPool[liquidityToken] += amount;
        liquidityToken.transferFrom(address(this), msg.sender, amount);
    }

    //create swap functions
    function swapToken(
        IERC20 tokenA,
        IERC20 tokenB,
        uint256 amount
    ) public {
        uint256 _swapValueA = swapValueA(tokenA, amount); // dollar equivalet for tokenA
        uint256 _swapValueB = swapValueB(tokenB, amount); // dollar equivalet for tokenB
        uint256 returnAmountB = _swapValueB / _swapValueA;
        tokenB.transferFrom(address(this), msg.sender, returnAmountB);
        uniqueTokenPool[tokenB] -= returnAmountB;
    }

    function swapValueA(IERC20 tokenA, uint256 _amount)
        internal
        returns (uint256)
    {
        if (tokenA == IERC20(LINK)) {
            uint256 rate = uint256(getLinkPrice());
            uint256 _swapAmountA = (rate * _amount) / 1e8;
            swapAmountA = _swapAmountA;
        } else if (tokenA == IERC20(DAI)) {
            uint256 rate = uint256(getDaiPrice());
            uint256 _swapAmountA = (rate * _amount) / 1e8;
            swapAmountA = _swapAmountA;
        } else if (tokenA == IERC20(USDC)) {
            uint256 rate = uint256(getUsdcPrice());
            uint256 _swapAmountA = (rate * _amount) / 1e8;
            swapAmountA = _swapAmountA;
        } else if (tokenA == IERC20(UNI)) {
            uint256 rate = uint256(getUniPrice());
            uint256 _swapAmountA = (rate * _amount) / 1e8;
            swapAmountA = _swapAmountA;
        }
        return swapAmountA;
    }

    ///////////////////////////////
    function swapValueB(IERC20 tokenB, uint256 _amount)
        internal
        returns (uint256)
    {
        if (tokenB == IERC20(LINK)) {
            uint256 rate = uint256(getLinkPrice());
            uint256 _swapAmountB = (rate * _amount) / 1e8;
            swapAmountB = _swapAmountB;
        } else if (tokenB == IERC20(DAI)) {
            uint256 rate = uint256(getDaiPrice());
            uint256 _swapAmountB = (rate * _amount) / 1e8;
            swapAmountB = _swapAmountB;
        } else if (tokenB == IERC20(USDC)) {
            uint256 rate = uint256(getUsdcPrice());
            uint256 _swapAmountB = (rate * _amount) / 1e8;
            swapAmountB = _swapAmountB;
        } else if (tokenB == IERC20(UNI)) {
            uint256 rate = uint256(getUniPrice());
            uint256 _swapAmountB = (rate * _amount) / 1e8;
            swapAmountB = _swapAmountB;
        }
        return swapAmountB;
    }
}

// link/usd = 0x48731cF7e84dc94C5f84577882c14Be11a5B7456
// forth/usd = 0x7A65Cf6C2ACE993f09231EC1Ea7363fb29C13f2F
// dai/usd = 0x0d79df66BE487753B02D015Fb622DED7f0E9798d
// usdc/usd = 0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7
