
if (typeof web3 !== 'undefined') {
           web3 = new Web3(web3.currentProvider);
       } else {
           // set the provider you want from Web3.providers
           web3 = new Web3(new Web3.providers.HttpProvider("http://77.81.247.173:8545"));
       }

/*
 var abi = [{"constant":true,"inputs":[{"name":"_id","type":"uint32"}],"name":"getStake","outputs":[{"components":[{"name":"staker","type":"address"},{"name":"id","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint32"}],"name":"provideStake","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"stakes","outputs":[{"name":"staker","type":"address"},{"name":"id","type":"uint256"},{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"creationTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_risks","type":"uint256[32]"}],"name":"provideScores","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingWithdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_oracle","type":"address"},{"name":"_fundingPeriod","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"staker","type":"address"}],"name":"NewStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"funder","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"NewFunding","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"stage","type":"uint8"}],"name":"StateChange","type":"event"}]
*/

var abi = [{"constant":true,"inputs":[{"name":"_id","type":"uint32"}],"name":"getStake","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"uint32"}],"name":"provideStake","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stage","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"stakes","outputs":[{"name":"staker","type":"address"},{"name":"id","type":"uint32"},{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"creationTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_risks","type":"uint256[32]"}],"name":"provideScores","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"pendingWithdrawals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_oracle","type":"address"},{"name":"_fundingPeriod","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"staker","type":"address"}],"name":"NewStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"funder","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"NewFunding","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"stage","type":"uint8"}],"name":"StateChange","type":"event"}]


var contractAddress = '0x996f7a76c56f7436749DAaC27a04e0e585Ec896A'

var myContract = new web3.eth.Contract(abi, contractAddress);

var staker = "0x3736780d08b18fba870dc06faa75182ed6864365";
var stake = 10;

var donor = "0xff42b09eb9978a14eb6fe807836a9f5c0ad37080";
var donation = 50000;

var oracle = "0x557de765e8f0aa3f7b9bf7a53cc35f614e9ffd55";

var scores;



/*
/* METHODS
*/

function donate() {
  if ( isNaN($("#stake_amount").val())
   || $("#stake_amount").val() < 1 || $("#stake_amount").val() > 20000 ){
    return false;
  }

  web3.eth.sendTransaction({from: donor, to: contractAddress, value: Math.floor($("#stake_amount").val())}).then(function(result) {
//    console.log('Balance of Contract: '+result);
  //  window.balance = result;
  // $("#contract_balance").html(result);
 getBalance();

  });


}

function do_stake(forestId) {

  // myContract.methods.provideStake(forestId).send({from: staker, value: stake, gas: 500000000})
  //   .then(function(receipt) {
  //     console.log(receipt);
  //   });

  // if ( isNaN($("#stake_amount").val())
  //  || $("#stake_amount").val() < 1  ){
  //  return false;
  // }

  var receipt =  myContract.methods.provideStake(forestId).send({from: staker, value: $("#stake_amount").val(), gas: 500000000}).then(function(receipt) {
      console.log(receipt);
      getBalance();
    });



  console.log(receipt);

}



function getBalance() {
//console.log(contractAddress);
  //var originalBalance = new web3.eth.getBalance(contractAddress).toNumber();




  web3.eth.getBalance(contractAddress).then(function(result) {
     console.log('Balance of Contract: '+result);
    window.balance = result;
   $("#contract_balance").html(result);
 });




}




// myContract.methods.getStake(10).call().then(function(result) {
//   console.log('Stake for id: '+result);
// });
//
//
// myContract.methods.pot().call().then(function(result) {
//   console.log('Total pot is: '+result);
// });



getBalance();
//donate(502);
//getBalance();
//provideStake(20);
//getBalance();










// myContract.methods.provideScores(scores).send({from: oracle})
//   .then(function(receipt) {
//
//     console.log(receipt);
//
//   });


// myContract.methods.withdraw().send({from: staker})
//   .then(function(receipt) {
//
//     console.log(receipt);
//
//   });

  /*
  /* EVENTS
  */

  // myContract.events.NewStake(function(error, event){ console.log(event); })
  // .on('data', function(event){
  //     console.log(event); // same results as the optional callback above
  // })
  // .on('changed', function(event){
  //     console.log(event);
  //     // remove event from local database
  // })
  // .on('error', console.error);
  //
  // myContract.events.NewFunding(function(error, event){ console.log(event); })
  // .on('data', function(event){
  //     console.log(event); // same results as the optional callback above
  // })
  // .on('changed', function(event){
  //     // remove event from local database
  // })
  // .on('error', console.error);

  // myContract.events.StateChange(function(error, event){ console.log(event); })
  // .on('data', function(event){
  //     console.log(event); // same results as the optional callback above
  // })
  // .on('changed', function(event){
  //     // remove event from local database
  // })
  // .on('error', console.error);
