// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        attack: 100, //攻击力
        red: 1000, //血量
        maxRed: 1000, //血量上限
        blue: 1000, //蓝量
        maxBlue: 1000, //蓝量上限
        moveSpeed: 0.0005, //移动速度
        radius: 10, //自身半径
        attackRadius: 20, //攻击半径
        play: false, //播放攻击动画的状态
        selected: false, //当前是否被选中
        camp: 'us', //'us' or 'enemy'
        sin: 1, //当前移动方向的sin
        cos: 0, //当前移动方向的cos
        isMoving: false, //当前是否正在移动，否时每一帧的update不更新位置
        shouldChase: false,
        path: null,
        curDestination: null, //当前的目标格子
        curTarget: { //当前的目标节点
            default: null,
            type: cc.Node
        },
        nextGrid: null,
        main: null,
        map: null
    },

    //如果没有选中，则选中（改变Main，原来选中的对象，还有自己的selected）
    onTouchStart(event) {
        //播放被摸的动画和特效
        this.displayTouchedAnimation();
        this.displayTouchedSound();

        console.log("touch start");
    },
    //
    onTouchEnd(event) {
        //在自己身上离开时，说明真的被选
        if (this.selected == false)
            this.configureSelection();
        //播放摸完的动画和音效
        this.displayDetouchedAnimation();
        this.displayTouchedSound();
        console.log("touch end");
    },
    onTouchCancel(event) {
        //播放摸完的动画和音效
        this.displayDetouchedAnimation();
        this.displayTouchedSound();
        console.log("touch cancel");
    },
    onLoad() {

    },
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },
    //播放被摸的动画特效
    displayTouchedAnimation() {
        //TODO
    },
    //播放被摸的音效
    displayTouchedSound() {
        //TODO
    },
    //播放摸完的动画特效（也就是恢复正常）
    displayDetouchedAnimation() {
        //TODO
    },
    //被选中需要进行一系列的状态更新
    configureSelection() {
        this.main.selectedHero = this;
        this.selected = true;
    },
    update(dt) {

        //操控状态下每帧根据角度及移动速度刷新位置
        if (this.camp == 'us' && this.isMoving) {
            if (this.node.x < 0 && this.cos < 0) {
                return;
            }
            if (this.node.x > 957 && this.cos > 0) {
                console.log('right')
                return;
            }
            if (this.node.y < 0 && this.sin < 0) {
                return;
            }
            if (this.node.y > 471 && this.sin > 0) {
                return;
            }
            this.node.x += this.moveSpeed * this.cos;
            this.node.y += this.moveSpeed * this.sin;
        } else if (true) {

        }

        if (this.shouldChase) {
            let target = this.judgeWhoToChase();
            if (target != null) {
                this.setTarget(target);
                this.chase(); //追踪
            }
        }
    },
    judgeWhoToChase() {
        if (this.camp == 'enemy' && this.main.pool != null && this.main.pool.length > 0) {
            for (let e of this.main.pool) {
                if (e.camp != this.camp)
                    return e;
            }
        }
        return null
    },
    chase() {
        //检查当前位置
        let here = this.map.locationOf(this.node);
        //如果已经达到下一步的位置，则从路径中取出下一个格子
        //如果路径已经走完，则直接返回，什么都不做
        while (this.nextGrid == null || (here.x == this.nextGrid.x && here.y == this.nextGrid.y)) {
            if (this.path.length != 0)
                this.nextGrid = this.path.pop();
            else
                return;
        }
        //根据下一步（如果还有下一步）的位置，设置角度并移动
        let deltaX = this.nextGrid.x - here.x;
        let deltaY = this.nextGrid.y - here.y;
        let distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        this.cos = deltaX / distance;
        this.sin = deltaY / distance;
        this.node.x += this.cos * this.moveSpeed;
        this.node.y += this.sin * this.moveSpeed;
    },
    //更新为空闲状态
    getIdle() {
        this.shouldChase = true;
    },

    setTarget(newTarget) {
        let targetLocation = this.map.locationOf(newTarget.node);
        if (this.curTarget != newTarget || this.curDestination == null || targetLocation.x != this.curDestination.x || targetLocation.y != this.curDestination.y) {
            this.curTarget = newTarget;
            this.curDestination = targetLocation;
            this.refindPath();
        }
    },
    refindPath() {
        this.path = this.map.aStarFindPath(this.curTarget, this.map.locationOf(this.node), this.curDestination);
    },
    //集中判断是否应当攻击一次
    shouldAttack(target) {
        let _x = this.node.x - target.node.x
        let _y = this.node.y - target.node.y
        let _d = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2))
        if (_d >= this.attackRadius + target.radius || //距离不够不攻击
            this.camp == target.camp || //同阵营不攻击
            this.red == 0 || target.red == 0 || //已死亡不攻击
            this.node == target.node || //节点相同不攻击
            _d > 150 || //距离远不攻击
            this.play == true) //正在播放动画不攻击
            return false;
        return true;
    },
    doAttack(target) {
        this.play = true;
        this.shouldChase = false;
        this.path = null;
        cc.tween(this.node).to(0.3, {
            rotation: 30
        }).to(0.3, {
            rotation: -30
        }).to(0.3, {
            rotation: 0
        }).call(() => {
            console.log("attack: " + this.name + " attacked " + target.name)
            this.play = false
            this.getIdle();
            if (target.red >= this.attack) {
                //检查装备
                target.red -= this.attack;
                //检查吸血
                //console.log(_component.attack)

            } else {
                target.red = 0;
                console.log("attack: " + target.name + ' dead');
            }


        }).start()
    },
    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },
});