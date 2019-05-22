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
        attack: 100,
        red: 1000,
        maxRed: 1000,
        blue: 1000,
        maxBlue: 1000,
        play: false, //播放攻击动画的状态
        selected: false, //是否可操作
        camp: 'us', //'us' or 'enemy'
        type: 'Hero' //'Hero' or 'Normal'
            // foo: {
            //     // ATTRIBUTES:
            //     default: null,        // The default value will be used only when the component attaching
            //                           // to a node for the first time
            //     type: cc.SpriteFrame, // optional, default is typeof default
            //     serializable: true,   // optional, default is true
            // },
            // bar: {
            //     get () {
            //         return this._bar;
            //     },
            //     set (value) {
            //         this._bar = value;
            //     }
            // },
    },

    // LIFE-CYCLE CALLBACKS:
    onKeyDown(event) {
        //如果是enemy单位不响应
        if (this.camp == 'enemy') return;
        //如果没血不响应
        if (this.red == 0) return;
        //没被选中不响应
        if (this.selected == false) return;

        let onlyMove = (x, y) => {
            cc.tween(this.node).to(0.3, {
                position: cc.v2(x, y)
            }).start()
        }

        switch (event.keyCode) {
            case cc.macro.KEY.w:
                onlyMove(this.node.x, this.node.y + 50)
                break
            case cc.macro.KEY.s:
                onlyMove(this.node.x, this.node.y - 50)
                break
            case cc.macro.KEY.a:
                onlyMove(this.node.x - 50, this.node.y)
                break
            case cc.macro.KEY.d:
                onlyMove(this.node.x + 50, this.node.y)
                break
            default:
                console.log("other")

        }
    },
    onKeyUp(event) {},
    //如果没有选中，则选中（改变Main，原来选中的对象，还有自己的selected）
    touched(event) {
        if (this.selected == false) {
            this.selected = true;

            let canvas = cc.find("Canvas").getComponent("Main")
            canvas.selectedHero.getComponent("Hero").selected = false
            canvas.selectedHero = this.node
            console.log("select:" + this.name)
            return;
        }

    },
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touched, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start() {

    },

    update(dt) {

    },
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
});