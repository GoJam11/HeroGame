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
        moveSpeed: 10, //移动速度
        radius: 10, //自身半径
        attackRadius: 20, //攻击半径
        play: false, //播放攻击动画的状态
        selected: false, //当前是否被选中
        camp: 'us', //'us' or 'enemy'
        sin: 1, //当前移动方向的sin
        cos: 0, //当前移动方向的cos
        isMoving: false, //当前是否正在移动，否时每一帧的update不更新位置
        selectionId: null //选中这个英雄的时候，那个触点的id
    },

    //如果没有选中，则选中（改变Main，原来选中的对象，还有自己的selected）
    onTouchStart(event) {
        //如果这次触摸到了我，则准备被selected（最终不一定被selected）
        if (this.ifTouchMe(event)) {
            this.selectionId = event.getID();
            //播放被摸的动画和特效
            this.displayTouchedAnimation();
            this.displayTouchedSound();
        }
    },
    //
    onTouchEnd(event) {
        //在自己身上离开时，说明真的被选
        if (event.getID() === this.selectionId && this.selected == false)
            this.configureSelection();
        //播放摸完的动画和音效
        this.displayDetouchedAnimation();
        this.displayTouchedSound();
    },
    onTouchCancel(event) {
        //播放摸完的动画和音效
        this.displayDetouchedAnimation();
        this.displayTouchedSound();
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
    //操纵手的触摸事件确定当前的移动角度
    setAngle(event) {
        //TODO
    },
    //是否摸到了我
    ifTouchMe(touchEvent) {
        //TODO
    },
    //被选中需要进行一系列的状态更新
    configureSelection() {
        //TODO
        let canvas = cc.find("Canvas").getComponent("Main")
        canvas.selectedHero.getComponent("Hero").selected = false
        canvas.selectedHero = this.node
        console.log("select:" + this.name)
        return;
    },
    update(dt) {

        //操控状态下每帧根据角度及移动速度刷新位置
        if (this.isMoving) {
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
    },
    //集中判断是否应当攻击一次
    shouldAttack(target) {
        let _x = this.node.x - target.node.x
        let _y = this.node.y - target.node.y
        let _d = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2))
        if (_d >= this.attackRadius + target.radius ||//距离不够不攻击
            this.camp == target.camp ||//同阵营不攻击
            this.red == 0 || target.red == 0 ||//已死亡不攻击
            this.node == target.node ||//节点相同不攻击
            _d > 150 ||//距离远不攻击
            this.play == true)//正在播放动画不攻击
            return false;
        return true;
    },
    doAttack(target){
        cc.tween(this.node).to(0.3, {
            rotation: 30
        }).to(0.3, {
            rotation: -30
        }).to(0.3, {
            rotation: 0
        }).call(() => {
            console.log("attack: " + this.name + " attacked " + target.name)
            this.play = false

            if (target.red >= this.attack) {
                //检查装备
                target.red -= this.attack
                    //检查吸血
                    //console.log(_component.attack)

            } else {
                target.red = 0
                console.log("attack: " + target.name + ' dead')
            }


        }).start()
    },
    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
});