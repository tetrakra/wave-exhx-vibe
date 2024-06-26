//crud and routing for our wave blocks
class Block {
    constructor(id, interval, modifier) {
      this.id = id;
      this.interval = interval;
      this.modifier = modifier;
      this.color = this.randomColor();
    }
  
    randomColor() {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 100%, 50%)`;
    }
  
    toHTML() {
      return `
        <div id="${this.id}" 
             class="block" 
             style="background-color: ${this.color};"
             hx-sse="connect:/wave-stream-${this.id}"
             hx-trigger="sse:message"
             hx-swap="none">
        </div>
      `;
    }
  
    getWaveData() {
      return Date.now() * this.modifier;
    }
  }
  
  class BlockManager {
    constructor() {
      this.blocks = new Map();
      this.blockCount = 0;
    }
  
    createBlock(interval, modifier) {
      this.blockCount++;
      const id = `block${this.blockCount}`;
      const newBlock = new Block(id, interval, modifier);
      this.blocks.set(id, newBlock);
      return newBlock;
    }
  
    getBlock(id) {
      return this.blocks.get(id);
    }

    getBlocks(){
      console.log(`blocks??? ${[...this.blocks]}`)
      const _blocks = [...this.blocks].map(([type, name]) => ({type, name}));
      return _blocks;
    }
  
    removeBlock(id) {
      this.blocks.delete(id);
    }
  }
  
  class BlockController {
    constructor(blockManager) {
      this.blockManager = blockManager;
    }
  
    setupRoutes(app) {
      app.post('/create-block', this.createBlock.bind(this));
      app.get('/wave-stream-:id', this.waveStream.bind(this));
      app.get('/wave-streams', this.waveStream.bind(this));
      app.post('/start-wave-stream/:id', this.startWaveStream.bind(this));
    }
  
    createBlock(req, res) {
      const { interval, modifier } = req.body;
      const newBlock = this.blockManager.createBlock(interval, modifier);
      res.send(newBlock.toHTML());
    }

    startWaveStream(req, res) {
      const block = this.blockManager.getBlock(req.params.id);
      if (!block) {
        return res.status(404).send('Block not found');
      }
  
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      
      const sendTime = () => {
        const time = block.getTimeData();
        res.write(`data: ${time}\n\n`);
      };
  
      const intervalId = setInterval(sendTime, block.interval);
  
      req.on('close', () => {
        clearInterval(intervalId);
      });
    }
  
    waveStream(req, res) {
      let multi = false;
      let block = null;
      let blocks = null;
      if (!req.params.id){
         blocks = this.blockManager.getBlocks();
        multi = true;
      } else {
         block = this.blockManager.getBlock(req.params.id);
      }
      
      if (!block && !blocks) {
        return res.status(404).send('Block not found ' + req.params.id);
      }
  
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      
      const sendWave = () => {
        if(!multi){
          const wave = block.getWaveData();
          res.write(`data: ${wave}\n\n`);
        } else {
            blocks.array.forEach(wave => {
              res.write(`data: ${wave}\n\n`);
            return;
          });
        }
   
      };
      
      const intervalId = multi ? 0 : setInterval(sendWave, block.interval);
  
      req.on('close', () => {
       
        if (!multi){
          clearInterval(intervalId);
          this.blockManager.removeBlock(block.id);
        }
       
      });
    }
  };

module.exports = { Block, BlockManager, BlockController };