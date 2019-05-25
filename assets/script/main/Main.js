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
        prefabHeroTom: {
            default: null,
            type: cc.Prefab
        },
        prefabHeroJerry: {
            default: null,
            type: cc.Prefab
        },
        prefabHero0: {
            default: null,
            type: cc.Prefab
        },
        prefabHero1: {
            default: null,
            type: cc.Prefab
        },
        prefabMap: {
            default: null,
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
            default: null,
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

    onLoad() {
        //切换到商店时不销毁节点
        cc.game.addPersistRootNode(this.node);

    },

    start() {
        let map = cc.instantiate(this.prefabMap);
        map.parent = this.node;
        this.map = map.getComponent("Map");

        this.scene = cc.find('bg', this.node);
        this.scene.parent = this.node;

        this.createRole("Jerry");
        this.createRole("Tom");

        let worldJerry = this.map.locationOf(this.pool[0].node);
        let worldTom = this.map.locationOf(this.pool[1].node);

        this.selectedHero = this.pool[0];
        console.log("Jerry:", worldJerry.x, worldJerry.y);
        console.log("Tom:", worldTom.x, worldTom.y);
    },

    update(dt) {
        this.updateAttack();
        this.updateStatusBar();
    },
    //创建角色('us'or'enemy','Hero'or'Normal',x,y)
    //返回节点和组件
    createRole(name, x, y, camp) {
        let node, hero;
        switch (name) {
            case 'Jerry':
                node = cc.instantiate(this.prefabHeroJerry);
                break;
            case 'Tom':
                node = cc.instantiate(this.prefabHeroTom);
                break;
            case 'Hero0':
                node = cc.instantiate(this.prefabHero0);
                break;
            case 'Hero1':
                node = cc.instantiate(this.prefabHero1);
                break;
            default:
                return;
        }
        hero = node.getComponent(name);
        if (camp != undefined)
            hero.camp = camp;
        if (x != undefined && y != undefined) {
            node.x = x;
            node.y = y;
        }
        hero.main = this;
        hero.map = this.map;
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
                //canvas节点切换为可销毁状态

            console.log(cc.game.isPersistRootNode(this.node))
            cc.game.removePersistRootNode(this.node)
            cc.director.loadScene("gameOver")
        }
    },
    //全局的攻击管理
    updateAttack() {
        let pool = this.pool;
        pool.forEach(attacker => {
            pool.forEach(attacked => {
                if (attacker.shouldAttack(attacked))
                    attacker.doAttack(attacked);
                else
                    attacker.getIdle();
            })
        })
    },
    onDestroy() {
        console.log('destroied')
    }
});