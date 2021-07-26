const SHA256=require('crypto-js/sha256');
const nodeUrl = process.argv[3];  
class Block{
    constructor(timestamp,Transactions,previousHash=''){
        
         
         this.timestamp=timestamp;
         this.Transactions=Transactions;
         this.previousHash=previousHash;
         this.hash=this.calculateHash();

         this.nonce=0;

    }
    
    calculateHash(){
        return SHA256(this.uid+this.previousHash+this.timestamp+this.nonce+JSON.stringify(this.Transactions)).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!== Array(difficulty+1).join('0')){
            this.nonce++;
            this.hash=this.calculateHash();
        }

        console.log("Block mined :"+this.hash);
    }

    


}

class Blockchain{

    constructor(){
        this.chain=[this.createGensis()];
        this.pendingTransactions = [];
        this.difficulty=2;     //Setting the difficulty
        this.nodeUrl = nodeUrl;         
        this.networkNodes = [];
    }   
    createGensis(){
        return new Block('IT ','Jaival Faisal Bautik todu log','0');
    }

    getLatestblock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBLock){
        newBLock.previousHash=this.getLatestblock().hash;
        newBLock.timestamp=Date.now();
        newBLock.Transactions=this.pendingTransactions.slice(0,10);
        newBLock.mineBlock(this.difficulty);
        this.chain.push(newBLock);
    }
    addTransactions(uid,receiver,location,age,gender){
        const Transactions={
            uid:uid,
            receiver:receiver,
            location:location,
            age:age,
            gender:gender
        }
       return Transactions;
        //this.PendingTransactions(Transactions);
     }
    PendingTransactions(Transactions){
        let total=this.pendingTransactions.length;
        if(total<10){
            this.pendingTransactions.push(Transactions);
        }
        else{
            this.pendingTransactions.push(Transactions);
            //console.log(this.pendingTransactions);
            const extra=this.pendingTransactions[10];
            //console.log(extra);
            this.addBlock(new Block);

           console.log('Mining since pending list is full!!!') ;
           console.log("hain:"+JSON.stringify(this.chain,null,4) ) ;

           this.pendingTransactions=[]; 
           this.pendingTransactions.push(extra);
           //console.log(this.pendingTransactions);

        }
        
    }
    

    isChainValid(){
        for(let i=1;i< this.chain.length;i++){
            const currentblock=this.chain[i];
            const previousblock=this.chain[i-1];
            
            if(currentblock.hash!==currentblock.calculateHash()){
                return false;
            }

            if(currentblock.previousHash!==previousblock.hash){
                return false;
            }
        }
        return true;
    }
    DoesVoteExist(uid){

        for(let i=1;i< this.chain.length;i++){
            const currentblock=this.chain[i];
            
            if(currentblock.uid==uid){
                return true;
            }
        }
    }
    Results(){

        for(let i=1;i< this.chain.length;i++){
            console.log(this.chain[i].Transactions);
            for(let j=1;i< 5;i++){
               // const s=JSON.stringify(this.chain[i].Transactions[j]);
                //console.log(s);
            }
        }
    }

}
/*let ch= new Blockchain();
console.log('mining block....');
ch.addBlock(new Block('s123','19/07',{test:1}));
console.log('mining block....');
ch.addBlock(new Block('s123','19/07',{test:2}));
console.log('is chain valid :'+ch.isChainvalid());*/
/*ch.chain[1].data={test:22};
console.log('is chain valid :'+ch.isChainvalid());
console.log(JSON.stringify(ch, null,4));
*/

module.exports = Blockchain;

/*let x= new Blockchain();

x.addTransactions('1','b','c','d','e');
x.addTransactions('2','b','c','d','e');
x.addTransactions('3','b','c','d','e');
x.addTransactions('4','b','c','d','e');
x.addTransactions('5','b','c','d','e');
x.addTransactions('6','b','c','d','e');
x.addTransactions('7','b','c','d','e');
x.addTransactions('8','b','c','d','e');
x.addTransactions('9','b','c','d','e');
x.addTransactions('10','b','c','d','e');
x.addTransactions('11','b','c','d','e');








x.addTransactions('xav','12','c','d','e');
x.addTransactions('xav','13','c','d','e');
x.addTransactions('xav','14','c','d','e');
x.addTransactions('xav','15','c','d','e');
x.addTransactions('xav','16','c','d','e');
x.addTransactions('xav','17','c','d','e');
x.addTransactions('xav','18','c','d','e');
x.addTransactions('xav','19','c','d','e');
x.addTransactions('xav','20','c','d','e');
x.addTransactions('xav','21','c','d','e');
x.addTransactions('xav','22','c','d','e');










console.log('Pending'+x.pendingTransactions);
console.log('Chain:'+JSON.stringify(x.chain,null,4));

x.Results();*/