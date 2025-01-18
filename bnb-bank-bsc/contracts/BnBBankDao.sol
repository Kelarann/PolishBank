/**

BnB Bank Training Project - Move banking products on chain.


**/

// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.15;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this;
        return msg.data;
    }
}

library Address {
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function sendValue(address payable recipient, uint256 amount) internal {
        require(
            address(this).balance >= amount,
            "Address: insufficient balance"
        );
        (bool success, ) = recipient.call{value: amount}("");
        require(
            success,
            "Address: unable to send value, recipient may have reverted"
        );
    }

    function functionCall(
        address target,
        bytes memory data
    ) internal returns (bytes memory) {
        return functionCall(target, data, "Address: low-level call failed");
    }

    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return
            functionCallWithValue(
                target,
                data,
                value,
                "Address: low-level call with value failed"
            );
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(
            address(this).balance >= value,
            "Address: insufficient balance for call"
        );
        require(isContract(target), "Address: call to non-contract");
        (bool success, bytes memory returndata) = target.call{value: value}(
            data
        );
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function functionStaticCall(
        address target,
        bytes memory data
    ) internal view returns (bytes memory) {
        return
            functionStaticCall(
                target,
                data,
                "Address: low-level static call failed"
            );
    }

    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        require(isContract(target), "Address: static call to non-contract");
        (bool success, bytes memory returndata) = target.staticcall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function functionDelegateCall(
        address target,
        bytes memory data
    ) internal returns (bytes memory) {
        return
            functionDelegateCall(
                target,
                data,
                "Address: low-level delegate call failed"
            );
    }

    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(isContract(target), "Address: delegate call to non-contract");
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return _verifyCallResult(success, returndata, errorMessage);
    }

    function _verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) private pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            if (returndata.length > 0) {
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        _owner = _msgSender();
        emit OwnershipTransferred(address(0), _owner);
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        require(msg.sender == owner(), "Only the owner can renounce ownership");
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

interface IUniswapV2Factory {
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint
    );
    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);
    function getPair(
        address tokenA,
        address tokenB
    ) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);
    function createPair(
        address tokenA,
        address tokenB
    ) external returns (address pair);
    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}

interface IUniswapV2Pair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);
    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(
        address owner,
        address spender
    ) external view returns (uint);
    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint value
    ) external returns (bool);
    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);
    function permit(
        address owner,
        address spender,
        uint value,
        uint deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
    event Burn(
        address indexed sender,
        uint amount0,
        uint amount1,
        address indexed to
    );
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);
    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves()
        external
        view
        returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(
        uint amount0Out,
        uint amount1Out,
        address to,
        bytes calldata data
    ) external;
    function skim(address to) external;
    function sync() external;
    function initialize(address, address) external;
}

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    )
        external
        payable
        returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);
    function swapTokensForExactETH(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapETHForExactTokens(
        uint amountOut,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);
    function quote(
        uint amountA,
        uint reserveA,
        uint reserveB
    ) external pure returns (uint amountB);
    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountOut);
    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountIn);
    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
    function getAmountsIn(
        uint amountOut,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

contract BnBBankDao is Context, IERC20, Ownable {
    using SafeMath for uint256;
    using Address for address;

    mapping(address => uint256) private _tOwned;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => bool) public checkNoFeeOrLimits_transfer;

    uint256 public constant INTEREST_RATE = 20;

    struct Proposal {
        string description;
        string[] options;
        uint256[] votes;
        bool isActive;
        uint256 endTime;
    }

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    string private _name = "BnBBankDAO";
    string private _symbol = "tBDAO";
    uint8 private _decimals = 18;
    uint256 private _tTotal = 1000000000 * 10 ** 18;
    uint256 private _tFeeTotal;

    uint8 private txCount = 0;
    uint8 private swapTrigger = 2;

    uint256 private _TotalFee = 6;
    uint256 public buy_fee = 3;
    uint256 public sell_fee = 3;

    uint256 public _maxHold = _tTotal.mul(2).div(100);
    uint256 public _maxTrx = _tTotal.mul(2).div(100);
    uint256 public _minTokenPercentageHoldDivider = 1000000;

    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;
    bool public inSwapAndLiquify;
    bool public swapAndLiquifyEnabled = true;

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public rewards;
    uint256 public totalDeposited;

    event SwapAndLiquifyEnabledUpdated(bool enabled);
    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );

    event ProposalCreated(
        uint256 proposalId,
        string description,
        string[] options,
        uint256 endTime
    );
    event Voted(uint256 proposalId, address voter, uint256 option);
    event Deposited(address indexed user, uint256 amount, address token);
    event Withdrawn(address indexed user, uint256 amount, address token);
    
    modifier lockTheSwap() {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    constructor(
        address _uniswapV2RouterAddress
    ) {
        require(_uniswapV2RouterAddress != address(0), "Router address cannot be zero");
        require(Address.isContract(_uniswapV2RouterAddress), "Router address must be a contract");

        _tOwned[owner()] = _tTotal;

        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(
            _uniswapV2RouterAddress
        );

        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());
        uniswapV2Router = _uniswapV2Router;
        checkNoFeeOrLimits_transfer[owner()] = true;
        checkNoFeeOrLimits_transfer[address(this)] = true;

        emit Transfer(address(0), owner(), _tTotal);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _tOwned[account];
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(
            sender,
            _msgSender(),
            _allowances[sender][_msgSender()].sub(
                amount,
                "ERC20: transfer amount exceeds allowance"
            )
        );
        return true;
    }

    function increaseAllowance(
        address spender,
        uint256 addedValue
    ) public virtual returns (bool) {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender].add(addedValue)
        );
        return true;
    }

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue
    ) public virtual returns (bool) {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender].sub(
                subtractedValue,
                "ERC20: decreased allowance below zero"
            )
        );
        return true;
    }

    function set_Swap_And_Liquify_Enabled(bool true_or_false) public onlyOwner {
        swapAndLiquifyEnabled = true_or_false;
        emit SwapAndLiquifyEnabledUpdated(true_or_false);
    }

    function set_Number_Of_Transactions_Before_Liquify_Trigger(
        uint8 number_of_transactions
    ) public onlyOwner {
        swapTrigger = number_of_transactions;
    }

    receive() external payable {}

    bool public checkfeetransfer_ = false;

    function updateMinTokenPercentageHoldDivider(
        uint256 newDivider
    ) external onlyOwner {
        require(newDivider > 0, "Divider must be greater than zero");
        _minTokenPercentageHoldDivider = newDivider;
    }

        function excludeTaxAndTrxLimit(address account) public onlyOwner {
        checkNoFeeOrLimits_transfer[account] = true;
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(
            owner != address(0) && spender != address(0),
            "ERR: zero address"
        );
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(address from, address to, uint256 amount) private {
        if (
            to != owner() &&
            to != address(this) &&
            to != uniswapV2Pair &&
            from != owner() &&
            !checkNoFeeOrLimits_transfer[from] &&
            !checkNoFeeOrLimits_transfer[to]
        ) {
            uint256 heldTokens = balanceOf(to);
            require(
                (heldTokens + amount) <= _maxHold,
                "You are trying to buy too many tokens. You have reached the limit for one wallet."
            );
        }

        if (
            from != owner() &&
            to != owner() &&
            !checkNoFeeOrLimits_transfer[from] &&
            !checkNoFeeOrLimits_transfer[to]
        )
            require(
                amount <= _maxTrx,
                "You are trying to buy more than the max transaction limit."
            );

        if (
            txCount >= swapTrigger &&
            !inSwapAndLiquify &&
            from != uniswapV2Pair &&
            swapAndLiquifyEnabled
        ) {
            txCount = 0;
            uint256 contractTokenBalance = balanceOf(address(this));
            if (contractTokenBalance > _maxTrx) {
                contractTokenBalance = _maxTrx;
            }
            if (contractTokenBalance > 0) {
                swapAndLiquify(contractTokenBalance);
            }
        }

        bool takeFee = true;

        if (
            checkNoFeeOrLimits_transfer[from] ||
            checkNoFeeOrLimits_transfer[to] ||
            (checkfeetransfer_ && from != uniswapV2Pair && to != uniswapV2Pair)
        ) {
            takeFee = false;
        } else if (from == uniswapV2Pair) {
            _TotalFee = buy_fee;
        } else if (to == uniswapV2Pair) {
            _TotalFee = sell_fee;
        }

        _tokenTransfer(from, to, amount, takeFee);
    }

    function sendToWallet(address payable wallet, uint256 amount) private {
        wallet.transfer(amount);
    }

    function swapAndLiquify(uint256 contractTokenBalance) private lockTheSwap {
        swapTokensForBNB(contractTokenBalance);
        uint256 contractBNB = address(this).balance;
        sendToWallet(payable(owner()), contractBNB);
    }

    function process_Transaction(
        uint256 percent_Of_Tokens_To_Process
    ) public onlyOwner {
        require(!inSwapAndLiquify, "Currently processing, try later.");
        if (percent_Of_Tokens_To_Process > 100) {
            percent_Of_Tokens_To_Process = 100;
        }
        uint256 tokensOnContract = balanceOf(address(this));
        uint256 sendTokens = tokensOnContract
            .mul(percent_Of_Tokens_To_Process)
            .div(100);
        swapAndLiquify(sendTokens);
    }

    function swapTokensForBNB(uint256 tokenAmount) private {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp
        );
    }

    function _tokenTransfer(
        address sender,
        address recipient,
        uint256 amount,
        bool takeFee
    ) private {
        if (!takeFee) {
            buy_fee = 0;
            sell_fee = 0;
            _TotalFee = 0;
        } else {
            txCount++;
        }
        _transferTokens(sender, recipient, amount);
    }

    function _transferTokens(
        address sender,
        address recipient,
        uint256 tAmount
    ) private {
        (uint256 tTransferAmount, uint256 tDev) = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _tOwned[address(this)] = _tOwned[address(this)].add(tDev);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _getValues(
        uint256 tAmount
    ) private view returns (uint256, uint256) {
        uint256 tDev = tAmount.mul(_TotalFee).div(100);
        uint256 tTransferAmount = tAmount.sub(tDev);
        return (tTransferAmount, tDev);
    }

    /**
     * DAO Functions
     */

    modifier onlyActiveProposal(uint256 proposalId) {
        require(proposals[proposalId].isActive, "Voting has ended");
        require(
            block.timestamp < proposals[proposalId].endTime,
            "Voting period has ended"
        );
        _;
    }

    function createProposal(
        string memory description,
        string[] memory options,
        uint256 votingPeriod
    ) external onlyOwner {
        require(options.length > 1, "There must be at least two options");

        Proposal memory newProposal;
        newProposal.description = description;
        newProposal.options = options;
        newProposal.votes = new uint256[](options.length);
        newProposal.isActive = true;
        newProposal.endTime = block.timestamp + votingPeriod;

        proposals.push(newProposal);

        emit ProposalCreated(
            proposals.length - 1,
            description,
            options,
            newProposal.endTime
        );
    }

    function vote(
        uint256 proposalId,
        uint256 option
    ) external onlyActiveProposal(proposalId) {
        require(!hasVoted[proposalId][msg.sender], "You have already voted");
        require(
            option < proposals[proposalId].options.length,
            "Invalid option"
        );

        uint256 minBalance = totalSupply().mul(1).div(
            _minTokenPercentageHoldDivider
        );
        require(
            balanceOf(msg.sender) >= minBalance,
            "You do not hold enough tokens to vote"
        );

        proposals[proposalId].votes[option]++;
        hasVoted[proposalId][msg.sender] = true;

        emit Voted(proposalId, msg.sender, option);
    }

    function endProposal(uint256 proposalId) external onlyOwner {
        require(proposals[proposalId].isActive, "Proposal is already inactive");
        proposals[proposalId].isActive = false;
    }

    function getProposal(
        uint256 proposalId
    )
        external
        view
        returns (
            string memory,
            string[] memory,
            uint256[] memory,
            bool,
            uint256
        )
    {
        Proposal memory proposal = proposals[proposalId];
        return (
            proposal.description,
            proposal.options,
            proposal.votes,
            proposal.isActive,
            proposal.endTime
        );
    }

    function getProposalResult(
        uint256 proposalId
    ) public view returns (string memory) {
        require(proposalId < proposals.length, "Proposal does not exist");

        Proposal memory proposal = proposals[proposalId];
        uint256 winningVoteCount = 0;
        uint256 winningOptionIndex = 0;

        for (uint256 i = 0; i < proposal.votes.length; i++) {
            if (proposal.votes[i] > winningVoteCount) {
                winningVoteCount = proposal.votes[i];
                winningOptionIndex = i;
            }
        }

        return proposal.options[winningOptionIndex];
    }

    function getAllProposals()
        external
        view
        returns (
            string[] memory descriptions,
            string[][] memory options,
            uint256[][] memory votes,
            bool[] memory isActive,
            uint256[] memory endTimes,
            string[] memory winningOptions
        )
    {
        uint256 count = proposals.length;
        descriptions = new string[](count);
        options = new string[][](count);
        votes = new uint256[][](count);
        isActive = new bool[](count);
        endTimes = new uint256[](count);
        winningOptions = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            Proposal memory proposal = proposals[i];
            descriptions[i] = proposal.description;
            options[i] = proposal.options;
            votes[i] = proposal.votes;
            isActive[i] = proposal.isActive;
            endTimes[i] = proposal.endTime;

            if (!proposal.isActive) {
                uint256 winningVoteCount = 0;
                string memory winningOption;
                for (uint256 j = 0; j < proposal.votes.length; j++) {
                    if (proposal.votes[j] > winningVoteCount) {
                        winningVoteCount = proposal.votes[j];
                        winningOption = proposal.options[j];
                    }
                }
                winningOptions[i] = winningOption;
            } else {
                winningOptions[i] = "";
            }
        }
    }


    /**
     * Depo Functions
     */

    function deposit(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        require(_tOwned[_msgSender()] >= amount, "Insufficient token balance");
        _transfer(_msgSender(), address(this), amount);

        deposits[msg.sender] += amount;
        totalDeposited += amount;

        emit Deposited(msg.sender, amount, address(this));
    }

    function withdrawDeposit() public {
        uint256 amount = deposits[msg.sender];
        require(amount > 0, "Insufficient balance");

        deposits[msg.sender] = deposits[msg.sender].sub(amount);
        totalDeposited -= amount;
        _transfer(address(this), _msgSender(), amount);

        emit Withdrawn(msg.sender, amount, address(this));
    }

    function terminationReward(address user) public view returns (uint256) {
        return (deposits[user] * INTEREST_RATE / 100) + deposits[user];
    }
}