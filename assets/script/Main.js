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
        prefabUsHero2:{
            default:null,
            type: cc.Prefab
        },
        prefabMap:{
            default:null,
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
        this.createRole('enemy', 'Hero', 155, -160)

        let node,_hero;
        node=cc.instantiate(this.prefabUsHero2);
        _hero=node.addComponent('Jerry');
        _hero.camp='us';
        let scene=cc.find('bg',this.node);
        node.parent=scene;
        node.setPosition(0,0);
        this.pool.push(node);
        console.log("width:"+cc.winSize.width+",height:"+cc.winSize.height);

        node=cc.instantiate(this.prefabMap);
        node.parent=this.node;
    },

    update(dt) {
        this.updateAttack();
        this.updateStatusBar()
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
    },
    //全局的攻击管理
    updateAttack(){
        let pool = cc.find('bg', this.node).children
        pool.forEach(attackerNode => {
            let attacker = attackerNode.getComponent('Hero')
            pool.forEach(attackedNode => {
                let attacked = attackedNode.getComponent('Hero')
                //应当攻击时发起攻击
                if(attacker.shouldAttack(attacked))
                    attacker.attack(attacked);
            })
        });
    }
});