pragma solidity ^0.4.18;


/*
/*       ______      _       ______                     __
/*      / ____/___ _(_)___  / ____/___  ________  _____/ /_
/*     / / __/ __ `/ / __ \/ /_  / __ \/ ___/ _ \/ ___/ __/
/*    / /_/ / /_/ / / / / / __/ / /_/ / /  /  __(__  ) /_
/*    \____/\__,_/_/_/ /_/_/    \____/_/   \___/____/\__/
/*
/*    The GainForest Contract holds funds of Donors
/*    and Stakes of (self-selected) caretakers. Each contract
/*    has a fixed duration and three stages. First, a setup or funding/staking
/*    stage. Second, a phase where a predefined oracle provides the ground truth
/*    based on satellite footage together with a priori predicted risk values
/*    based on a neutral network. Various functions are currently deactivated for
/*    the sake of demonstration.
/*
*/

contract Forest {
  // Stages/states of the contract
  enum Stages {
    Setup,
    WaitForOracle,
    AllowWithdrawal
  }

  // Initialialize stage
  Stages public stage = Stages.Setup;


  // Representation of a stake in a particualr piece of
  // land as represented by id
  struct Stake {
    address staker;
    uint32 id;
    uint amount;
  }

  mapping (uint => Stake) public stakes;
  mapping (address => uint) public pendingWithdrawals;

  //address[] stakerAddresses;

  uint public creationTime = now;
  address oracle;
  uint fundingPeriod;
  uint public pot = 0;
  uint totalStakesTimesRisk = 0;

  // Events to notify dApps
  event NewStake(address staker);
  event NewFunding(address funder, uint amount);
  event StateChange(Stages stage);

  // Constructor
  function Forest(
    address _oracle,
    uint _fundingPeriod) public
  {
    oracle = _oracle;
    fundingPeriod = _fundingPeriod;
  }


// Internal utility function to foster state change
function nextStage() internal {
    stage = Stages(uint(stage) + 1);
    StateChange(stage);
}

/*
/* MODIFIERS
*/

modifier atStage(Stages _stage) {
   require(stage == _stage);
   _;
}

// Perform timed transitions.
modifier timedTransitions() {
   if (stage == Stages.Setup &&
               now >= creationTime + fundingPeriod)
       nextStage();
   // The other stages transition by transaction
   _;
}

modifier onlyOracle() {
 require(msg.sender == oracle);
 _;
}

modifier withMoney() {
 require(msg.value > 0);
 _;
}


/*
/* PUBLIC FUNCTIONS
*/

// Function for stakers/caretakers
function provideStake(uint32 _id)
   payable
   withMoney
   //timedTransitions
   atStage(Stages.Setup) public
{
   // We want that there can only one stake per id in order to simplify
   // the calculation later on. However the nexrt line does not work
   require(stakes[_id].amount == 0);
   stakes[_id] = Stake(msg.sender, _id, msg.value);
   //stakerAddresses.push(msg.sender);
   NewStake(msg.sender);
}


function getStake(uint32 _id) public constant returns(address, uint) {

  return (stakes[_id].staker,stakes[_id].amount);

}

function calculatePayouts(uint[32] _risks) internal {

  for (uint i=0; i<256; i++) {
    totalStakesTimesRisk += stakes[i].amount*_risks[i];
  }
  for (i=0; i<256; i++) {
    pendingWithdrawals[stakes[i].staker] += stakes[i].amount*_risks[i]/totalStakesTimesRisk*this.balance;
  }
}

    function provideScores(uint[32] _risks) public
        //timedTransitions
        onlyOracle
        atStage(Stages.WaitForOracle)
    {
        calculatePayouts(_risks);
        nextStage();
    }

    function withdraw()
        atStage(Stages.AllowWithdrawal) public {
        uint amount = pendingWithdrawals[msg.sender];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

// Fallback function for donors
    function()
        payable
        //timedTransitions
        atStage(Stages.Setup) public
    {
      pot = pot + msg.value;
      // to do: add event

    }
}
