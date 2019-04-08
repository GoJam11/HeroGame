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
        myHero: {
            default: null,
            type: cc.Node
        },
        hero: {
            default: null,
            type: cc.Node
        },
        pool: [cc.Node],
        distance: [],
        timer: null

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

    // onLoad () {},

    start() {
        this.myHero = cc.find("bg/MyHero", this.node)
        this.hero = cc.find("bg/Hero", this.node)
        this.pool.push(this.myHero)
        this.pool.push(this.hero)

    },

    update(dt) {
        //attack
        this.pool.forEach(el => {
            this.pool.forEach(ele => {
                let _x = el.x - ele.x
                let _y = el.y - ele.y
                let _d = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2))
                if (_d < 150 && el != ele) {
                    console.log("attack")
                        //如果计时器=0或>0.3允许动画并开始计时，如果在0-0.3之间不执行动画
                    this.timer = new Date()
                    cc.tween(el).to(0.3, { rotation: 30 }).start()
                }

            })
        });
    },
});