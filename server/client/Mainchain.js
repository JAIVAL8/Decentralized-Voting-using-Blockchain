const SHA256=require('crypto-js/sha256');

class Block{
    constructor(uid,timestamp,data,previousHash=''){
         this.uid=uid;
         
         this.timestamp=timestamp;
         this.data=data;
         this.previousHash=previousHash;
         this.hash=this.calculateHash();

    }
    calculateHash(){
        return SHA256(this.uid+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString();
    }


}

class Blockchain{
    constructor(){
        this.chain=[this.createGensis()];
    }   
    createGensis(){
        return new Block('Null','19/072021','FIrst B','0');
    }

    getLatestblock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBLock){
        newBLock.previousHash=this.getLatestblock().hash;
        newBLock.hash=newBLock.calculateHash();
        this.chain.push(newBLock);
    }
    isChainvalid(){
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
}

let ch= new Blockchain();
ch.addBlock(new Block('s123','19/07',{test:1}));
ch.addBlock(new Block('s123','19/07',{test:2}));
console.log('is chain valid :'+ch.isChainvalid());
ch.chain[1].data={test:22};
console.log('is chain valid :'+ch.isChainvalid());
console.log(JSON.stringify(ch, null,4));