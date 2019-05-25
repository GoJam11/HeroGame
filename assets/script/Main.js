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

        prefabEnemyHero: {
            default: null,
            type: cc.Prefab
        },
        prefabUsHero: {
            default: null,
            type: cc.Prefab
        },
        //当前选中的英雄
        selectedHero: {
            default: null,
            type: cc.Node
        },
        pool: [cc.Node],
        distance: []

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

    onLoad() {
        let hero = this.createRole('us', 'Hero', 100, 320)
        this.selectedHero = hero
        hero.selected = true
        this.createRole('enemy', 'Hero', 455, 320)
        cc.find('circle').getComponent('Circle').role = hero

    },

    update(dt) {
        let pool = cc.find('bg', this.node).children
        pool.forEach(el => {
            let _component = el.getComponent('Hero')
                //没血不循环
            if (_component.red == 0) return;
            pool.forEach(ele => {
                let _component1 = ele.getComponent('Hero')
                    //console.log(el.getComponents("Hero"))
                let _x = el.x - ele.x
                let _y = el.y - ele.y
                let _d = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2))
                    //距离远不攻击
                if (_d > 150) return;
                this.attack(el, ele, _component, _component1, _d)

            })
        });
        this.updateStatusBar()

    },
    //管理攻击(节点1，节点2，节点1组件，节点2组件，距离)
    //节点1攻击节点2
    attack(el, ele, _component, _component1, _d) {
        //同阵营不攻击
        if (_component.camp == _component1.camp) return;
        //已死亡不攻击
        if (_component.red == 0 || _component1.red == 0) return;
        //正在播放动画不攻击
        if (_component.play == true) return;
        //节点1和节点2相同不攻击
        if (el == ele) return;

        //攻击流程
        _component.play = true
        cc.tween(el).to(0.3, {
            rotation: 30
        }).to(0.3, {
            rotation: -30
        }).to(0.3, {
            rotation: 0
        }).call(() => {
            console.log("attack: " + _component.name + " attacked " + _component1.name)
            _component.play = false

            if (_component1.red >= _component.attack) {
                //检查装备
                _component1.red -= _component.attack
                    //检查吸血
                    //console.log(_component.attack)

            } else {
                _component1.red = 0
                console.log("attack: " + hero.name + ' dead')
            }


        }).start()

    },
    //创建角色('us'or'enemy','Hero'or'Normal',x,y)
    //返回节点和组件
    createRole(camp, type, x, y) {
        let node, Hero;
        if (camp == 'enemy' && type == 'Hero') {
            node = cc.instantiate(this.prefabEnemyHero)
            Hero = node.addComponent(type)
            Hero.camp = camp
            Hero.attack = 500
        } else if (camp == 'us' && type == 'Hero') {
            node = cc.instantiate(this.prefabUsHero)
            Hero = node.addComponent(type)
            Hero.camp = camp
        }
        var scene = cc.find('bg', this.node)
        node.parent = scene
        node.setPosition(x, y)
        this.pool.push(node)
        return Hero
    },
    //状态栏管理 StatusBar
    updateStatusBar() {
        let hero = this.pool[0].getComponent('Hero')
            //对选中单位的信息进行更新
        let blood = cc.find('StatusBar/blood', this.node)
        blood.width = hero.red / 1000 * 1920
        if (hero.red == 0) {
            hero.node.color = new cc.Color(215, 215, 213)
            cc.director.loadScene("gameOver");
        }
    }
});