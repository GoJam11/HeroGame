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
<<<<<<< HEAD

        prefabEnemyHero: {
=======
        prefabHeroTom: {
>>>>>>> 418601495ac76c91cf21166220cfeafc430e1d7c
            default: null,
            type: cc.Prefab
        },
        prefabHeroJerry:{
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
            type: cc.Component
        },
        pool: [cc.Node],
        distance: [],
        map: {
            default:null,
            type: cc.Component
        },
        scene: null

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

    onLoad () {},

<<<<<<< HEAD
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
=======
    start() {
        let map=cc.instantiate(this.prefabMap);
        map.parent=this.node;
        this.map=map.getComponent("Map");

        this.scene=cc.find('bg',this.node);
        this.scene.parent=this.node;
>>>>>>> 418601495ac76c91cf21166220cfeafc430e1d7c

        this.createRole("Jerry");
        this.createRole("Tom");

<<<<<<< HEAD
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
=======
        let worldJerry=this.map.locationOf(this.pool[0].node);
        let worldTom=this.map.locationOf(this.pool[1].node);
>>>>>>> 418601495ac76c91cf21166220cfeafc430e1d7c

        this.selectedHero=this.pool[0];
        console.log("Jerry:",worldJerry.x,worldJerry.y);
        console.log("Tom:",worldTom.x,worldTom.y);
    },

    update(dt) {
        this.updateAttack();
        this.updateStatusBar();
    },
    //创建角色('us'or'enemy','Hero'or'Normal',x,y)
    //返回节点和组件
    createRole(name,x, y,camp) {
        let node, hero;
        switch(name){
            case 'Jerry':node=cc.instantiate(this.prefabHeroJerry);
                break;
            case 'Tom':node=cc.instantiate(this.prefabHeroTom);
                break;
            default:
                return;
        }
        hero=node.getComponent(name);
        if(camp!=undefined)
            hero.camp=camp;
        if(x!=undefined&&y!=undefined){
            node.x=x;
            node.y=y;
        }
        hero.main=this;
        hero.map=this.map;
        node.parent = this.scene;
        this.pool.push(hero);
    },
    //状态栏管理 StatusBar
    updateStatusBar() {
        let hero = this.pool[1];
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
        let pool = this.pool;
        pool.forEach(attacker=>{
            pool.forEach( attacked=>{
                if(attacker.shouldAttack(attacked))
                    attacker.doAttack(attacked);
                else
                    attacker.getIdle();
            })    
        })
    }
});