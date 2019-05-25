// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//地图上的每一个格子
function Grid(owner, price) {
    this.owner = owner;
    this.price = price;
}
//用于寻路的AStar数据结构
function AStar(previous, here, destination, map) {
    this.previous = previous;
    this.g = 0;
    if (previous != null) {
        let distance = (previous.x != here.x && previous.y != here.y) ? 14 : 10;
        this.g = distance * map[here.x][here.y].price + previous.g;
    }
    this.x = here.x;
    this.y = here.y;
    let deltaX = destination.x - here.x;
    let deltaY = destination.y - here.y;
    this.h = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    this.f = this.g + this.h;

}
//关闭列表，是一个包装后的数组
function Aector(){
    this.array=new Array();
}
Aector.prototype.find=function(location){
    for (let element of this.array) {
        if (element.x == location.x && element.y == location.y)
            return true;
    }
    return false;
}
Aector.prototype.add=function(aStar){
    this.array.push(aStar);
}
//打开列表，是一个优先队列
function Quene() {
    this.heap = new Array();
}
Quene.prototype.insert = function (aStar) {
    this.heap.push(aStar);
    this.heapifyUp(this.heap.length - 1);
}
Quene.prototype.removeFirst = function () {
    if (this.heap.length > 0) {
        if(this.heap.length ==1)
            return this.heap.pop();
        let minAStar = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return minAStar;
    } else
        return null;
}
Quene.prototype.heapifyUp = function (startIndex) {
    let curIndex = startIndex;
    while (curIndex > 0) {
        let father = Math.floor((curIndex - 1) / 2);
        if (this.heap[father].f > this.heap[curIndex].f) {
            [this.heap[father], this.heap[curIndex]] = [this.heap[curIndex], this.heap[father]];
            curIndex = father;
        } else
            break;
    }
}
Quene.prototype.heapifyDown = function (startIndex) {
    let curIndex = startIndex;
    while (2 * curIndex + 2 < this.heap.length) {
        let left = 2 * curIndex + 1;
        let right = left + 1;
        if (this.heap[left].f >= this.heap[curIndex].f && this.heap[right].f >= this.heap[curIndex].f)
            break;
        else {
            if (this.heap[left].f < this.heap[right].f) {
                [this.heap[left], this.heap[curIndex]] = [this.heap[curIndex], this.heap[left]];
                curIndex = left;
            }
            else {
                [this.heap[right], this.heap[curIndex]] = [this.heap[curIndex], this.heap[right]];
                curIndex = right;
            }
        }
    }
    let finalRight = 2 * curIndex + 1;
    if (finalRight < this.heap.length && this.heap[finalRight].f < this.heap[curIndex].f)
        [this.heap[finalRight], this.heap[curIndex]] = [this.heap[curIndex], this.heap[finalRight]];
}
Quene.prototype.isEmpty = function () {
    return this.heap.length == 0;
}
Quene.prototype.find = function (location) {
    for (let element of this.heap) {
        if (element.x == location.x && element.y == location.y)
            return element;
    }
    return null;
}
cc.Class({
    extends: cc.Component,

    properties: {
        _map: null,
        sizeX: {
            default: 1,
            type: cc.Integer
        },
        sizeY: {
            default: 1,
            type: cc.Integer
        },
        _numX: {
            default: 1,
            type: cc.Integer
        },
        _numY: {
            default: 1,
            type: cc.Integer
        },
    },

    onLoad() {
        //计算横竖grid的数量和总量
        this._numX = Math.ceil(cc.winSize.width*4 / this.sizeX);
        this._numY = Math.ceil(cc.winSize.height*4 / this.sizeY);
        this._total = this._numX * this._numY;
        //生成map
        this._map = new Array(this._numX);
        for (let column = 0; column < this._numX; column++) {
            this._map[column] = new Array(this._numY);
            for (let line = 0; line < this._numY; line++)
                this._map[column][line] = new Grid(null, 1);
        }
        //有人挡着，绕行
        // for (let line = 0; line < 10; line++)
        //     this._map[5][line] = new Grid(new Quene(), 0);
        //代价不高，仍然原路走
        // for (let line = 0; line < 10; line++)
        //     this._map[5][line] = new Grid(null, 10);
        //代价极高，绕行
        // for (let line = 0; line < 10; line++)
        //     this._map[5][line] = new Grid(null, 100);
        console.log(this.sizeX, this.sizeX, this._numX, this._numY);
        let path=this.aStarFindPath(null, { x: 0, y: 0 }, { x: 0, y: 0 });
        for(let setp of path){
            console.log(setp.x,setp.y);
        }
    },
    locationOf(node) {
        let wordLocation = node.convertToWorldSpaceAR(node);
        let gridX = Math.floor(wordLocation.x / this.sizeX);
        let gridY = Math.floor(wordLocation.y / this.sizeY);
        return {
            x: gridX,
            y: gridY
        }
    },
    centerPixOf(location){
        return {
            x:Math.floor((location.x+0.5)*this.sizeX),
            y:Math.floor((location.y+0.5)*this.sizeY)
        };
    },
    //从from寻路到to
    aStarFindPath(target, from, to) {
        let openList = new Quene();//打开列表
        let closeList = new Aector();//关闭列表
        let path=new Array();//最终路径
        let curGrid;//当前格子
        //插入起点
        openList.insert(new AStar(null, from, to, this._map));
        while (true) {
            //取出第一项
            curGrid = openList.removeFirst();
            //加入closeList
            closeList.add(curGrid);
            //对四周可行的格子依次遍历，看是否已经建筑物边缘
            let touchButNotReach = this.traverseSurround(openList, closeList, curGrid,to, target);
            //决定下一步该干什么
            if (openList.isEmpty() ||//无路可走时寻路结束
                touchButNotReach ||//抵达建筑物边缘时寻路结束
                (curGrid.x == to.x && curGrid.y == to.y))//直接抵达目标时寻路结束
                break;
        }
        //整理路径
        path.push(curGrid);
        while (curGrid.previous != null) {
            curGrid = curGrid.previous;
            path.push(curGrid);
        }
        return path;
    },
    //遍历这个格子可行的四周，寻找下一步,若有目标而且触碰到目标边缘（无需到达锚点），则返回true，其他情况返回false
    traverseSurround(openList, closeList, curGrid, to,target) {
        let left = (curGrid.x > 0) ? (curGrid.x - 1) : curGrid.x;
        let right = (curGrid.x < this._numX - 1) ? (curGrid.x + 1) : curGrid.x;
        let down = (curGrid.y > 0) ? (curGrid.y - 1) : curGrid.y;
        let up = (curGrid.y < this._numY - 1) ? (curGrid.y + 1) : curGrid.y;
        for (let _x = left; _x <= right; _x++) {
            for (let _y = down; _y <= up; _y++) {
                //这个格子的占据点
                let owner=this._map[_x][_y].owner;
                //目标为建筑物时，判断是否到达建筑物边缘，到达边缘即返回
                if (target != null && owner == target)
                    return true;
                //有人占据，又没有通过上一条判断，说明这个是障碍物，应当返回不做处理
                if(owner!=null)
                    continue;
                //这个格子的位置
                let candidate = {
                    x: _x,
                    y: _y
                }
                //假如在closeList中则直接不处理
                if (!closeList.find(candidate)) {
                    //在openList中查找
                    let result = openList.find(candidate);
                    //未找到时，生成一个这个位置的AStar插入openList
                    if (result == null)
                        openList.insert(new AStar(curGrid, candidate, to, this._map));
                    else {//找到时,如果有必要，更新这个AStar
                        let g = ((curGrid.x != candidate.x && curGrid.y != candidate.y) ? 14 : 10) * this._map[_x][_y].price;
                        //新路径的长度如果更短，则更新
                        if (g + curGrid.g < result.g) {
                            result.g = g + curGrid.g;
                            result.f = result.g + result.h;
                            result.previous = curGrid;
                        }
                    }
                }
            }
        }
        return false;
    },
    dStarfindPath(from, to) {
        
    },
    start() {

    },
    // update (dt) {},
});
