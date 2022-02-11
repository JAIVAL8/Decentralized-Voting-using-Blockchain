const SHA256=require('crypto-js/sha256');
const nodeUrl =process.argv[3];  
class Block{
        //Block constructor 
        constructor(timestamp,Transactions,previousHash=''){
            
            this.timestamp=timestamp;
            this.Transactions=Transactions;
            this.previousHash=previousHash;
            this.hash;
            this.nonce=0;
            this.miner='<----------------Creator------------------->';
        }

}

 class Blockchain {
    
    constructor(){
        this.chain=[this.createGensis()];
        this.pendingTransactions = [];
        this.difficulty;  //Setting the difficulty
        this.nodeUrl = nodeUrl;         
        this.networkNodes = [];
        this.maxvotes;//setting max amount of votes per block
    } 
    //mining difficulty func.
    mineBlock(addBlock){
        addBlock.miner=nodeUrl;
        addBlock.hash='default';
        while(addBlock.hash.substring(0,this.difficulty)!== Array(this.difficulty+1).join('0')){
           addBlock.nonce++;
           addBlock.hash=this.calculateHash(addBlock);
            
        }
      
        console.log("Block mined :"+addBlock.hash);
       
        return addBlock;
    }
    //hash generation func.
    calculateHash(addBlock){
        return SHA256(addBlock.previousHash+addBlock.timestamp+addBlock.miner+addBlock.nonce+JSON.stringify(addBlock.Transactions)).toString();
    } 
   
    //Genesis Block
    createGensis(){
        
        const genesisBlock= new Block('IT','Jaival Faisal Bautik','0');
         genesisBlock.hash=this.calculateHash(genesisBlock);
         return genesisBlock;
    }

    //Returns last block
    getLatestblock(){
        return this.chain[this.chain.length-1];
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
        // this.PendingTransactions(Transactions);
     }

     createBlock(state){
        // console.log('state:',state);
        const newBLock=new Block;

        newBLock.previousHash=this.getLatestblock().hash;
        newBLock.timestamp=Date.now();
        if(state==false){
        newBLock.Transactions=this.pendingTransactions.slice(0,this.maxvotes);
    	}
        else{
            newBLock.Transactions=this.pendingTransactions;
        }
        
        // newBLock.mineBlock(this.difficulty);

        // console.log("Block  :"+JSON.stringify(newBLock));
        return newBLock;

        // this.mineBlock(this.difficulty,newBLock)
        // this.chain.push(newBLock);
    }
    addBlock(newBlock){
        this.chain.push(newBlock);
    }

    // Forces the  incomplete block
    ForceTransactionBlock(){
       
        const addBlock=this.createBlock(true);
        addBlock.hash=this.calculateHash(addBlock);
        this.addBlock(addBlock);

        console.log(' Forced-Mining!!! ');
        this.pendingTransactions=[]; 
    }

  
    
   
   
    isChainValid(){
        const genesisBlock = this.chain[0];
        if ((genesisBlock.timestamp !== 'IT') ||
            (genesisBlock.nonce !== 0) ||
          (genesisBlock.previousHash !== '0') ||
          (genesisBlock.Transactions !== 'Jaival Faisal Bautik')) {
            console.log("invalid");
            return false;
            }
        
        for(let i=1;i< this.chain.length;i++){
            const currentblock=this.chain[i];
            const previousblock=this.chain[i-1];
            
           
            if(currentblock.hash!==this.calculateHash(currentblock) ){
                return false;
            }

            if(currentblock.previousHash!==previousblock.hash){
                return false;
            }
        }
        return true;
    }

    //Exisiting uid check function
    DoesVoteExist(uid){
     
        if(this.getLatestblock().Transactions=='Jaival Faisal Bautik' && this.pendingTransactions.length==0){
            // console.log('condition-1');
            return false;
        }
        else if(this.getLatestblock().Transactions=='Jaival Faisal Bautik' && this.pendingTransactions.length!=0){
            // console.log('condition-2');
            for(let i=0;i< this.pendingTransactions.length;i++){
                
                const current= Object.values(this.pendingTransactions[i]);
                // console.log(current.length);
               
                    // console.log(current[0]);
                    if(current[0]==uid){
                        console.log('True uid Exist');
                       
                        return true;
                    }
                
            } 
        }
        
        else if(this.getLatestblock().Transactions!='Jaival Faisal Bautik'&&this.pendingTransactions.length!=0){
            // console.log('condition-4');
            for(let i=0;i< this.pendingTransactions.length;i++){
                const current= Object.values(this.pendingTransactions[i]);
                // console.log(current.length);
               
                    // console.log(current[0]);
                    if(current[0]==uid){
                        console.log('True uid Exist');
                       
                        return true;
                    }
            }
            for(let i=1;i< this.chain.length;i++){
               
                const currentblock=this.chain[i].Transactions;
                // console.log(currentblock);
                for(let j=0;j< currentblock.length;j++){
                
                    if(currentblock[j].uid==uid){
                        // console.log('True uid Exist');
                        // console.log(currentblock[j].uid);
                        return true;
                    }
                }
            }
        }
        return false;
            
    }
    Results(){
        console.log("hiii")
        let Votedlist = [];
        for (let i = 1; i < this.chain.length; i++) {
            const currentblock = this.chain[i].Transactions;

            for (let j = 0; j < currentblock.length; j++) {
            Votedlist.push(currentblock[j]);
            }
        }
        return Votedlist;
    }
    
}


module.exports = Blockchain;

