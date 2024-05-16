import { _decorator, instantiate, Prefab, Quat, Vec3 } from 'cc';
import { cBody } from '../collision/Body';
import { cObject, Trigger } from '../collision/Object';
const { ccclass, property } = _decorator;

const tempPos = new Vec3();
const tempRot = new Quat();

@ccclass('Bullet')
export class Bullet extends cObject {

    //缓存池管理
    static pools: Array<Bullet> = [];
    static get(prefab: Prefab) {
        let bullet = this.pools.pop();
        if (!bullet) {
            let node = instantiate(prefab);
            bullet = node.getComponent(Bullet);
        }
        return bullet;
    }

    static put(bullet: Bullet) {
        //压入缓存池管理节点
        this.pools.push(bullet);
        //移除node不回收body
        bullet.remove(false);
    }

    //生命周期，回收时间
    lifeTime: number = 0;
    //attack: number = 0;

    update(dt: number) {

        this.lifeTime -= dt;
        if (this.lifeTime < 0) {
            //生命周期回收
            Bullet.put(this);
            return;
        }

        //计算新位置
        let pos = this.getPosition();
        let velocity = this.velocity;

        tempPos.x = pos.x + velocity.x * dt;
        tempPos.y = pos.y + velocity.y * dt;
        tempPos.z = pos.z + velocity.z * dt;

        this.setPosition(tempPos);

    }


    onTrigger(b: cBody,trigger: Trigger) {
        if(trigger == Trigger.exit ) return;
         //击中回收子弹
        Bullet.put(this);

        //播放爆炸特效
        //.........
    }
}
