// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//用户操作分为短按、长按、长按并移动
cc.Class({
    extends: cc.Component,

    properties: {
        press: false, //是否按压
        x: 0,
        y: 0,
        role: {
            default: null,
            type: cc.Component
        },
        center: {
            default: {}
        },
        main: null
            //x,y遇到move才更新
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

    onLoad() {
        this.center = {
            x: 162,
            y: 168
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchstart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchend, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchcancel, this)

    },

    start() {
        //162,168
        //this.role=
        this.press = true
        this.main = this.node.parent.getComponent("Main");
        console.log(this.main);
    },
    touchstart(e) {
        let hero = this.main.selectedHero
        if (hero != null && hero.camp == 'us') {
            hero.isMoving = true
            let ag = this.getAngle(e.getLocation());
            hero.sin = ag.sin
            hero.cos = ag.cos
        }
    },
    touchmove(e) {
        let hero = this.main.selectedHero
        if (hero != null && hero.camp == 'us') {
            hero.isMoving = true
            let ag = this.getAngle(e.getLocation());
            hero.sin = ag.sin
            hero.cos = ag.cos
        }
    },
    touchend(e) {
        let hero = this.main.selectedHero
        if (hero != null && hero.camp == 'us') {
            hero.isMoving = false
                //console.log('end')
        }
    },
    touchcancel(e) {
        let hero = this.main.selectedHero
        if (hero != null && hero.camp == 'us') {
            hero.isMoving = false
                //console.log('cancel')
        }
    },
    getAngle(loc) {
        let distance = Math.sqrt(Math.pow(loc.x - this.center.x, 2) + Math.pow(loc.y - this.center.y, 2))
        let sin = (loc.y - this.center.y) / distance;
        let cos = (loc.x - this.center.x) / distance;

        return { sin, cos }
    },
    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchstart, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchmove, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchend, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchcancel, this)
    }
});