import Watcher from "./watcher";
import { init } from "snabbdom/build/package/init";
import { classModule } from "snabbdom/build/package/modules/class";
import { propsModule } from "snabbdom/build/package/modules/props";
import { styleModule } from "snabbdom/build/package/modules/style";
import { eventListenersModule } from "snabbdom/build/package/modules/eventlisteners";
import { toVNode } from 'snabbdom/build/package/tovnode'
import { attributesModule } from 'snabbdom/build/package/modules/attributes'


var patch = init([
  propsModule,
  styleModule,
  eventListenersModule,
  attributesModule,
  classModule
]);
export default class Complier {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    let _vnode = this.vm._render(this.vm._c);
    _vnode.elm = this.el
    this.vnode = patch(toVNode(this.el), _vnode);
    this.complie();

  }
  complie() {
    Object.keys(this.vm.$data).forEach((key) => {
      new Watcher(this.vm, key, (newVal) => {
        var _vnode = this.vm._render(this.vm._c);
        _vnode.elm = this.vnode.elm
        this.vnode = patch(this.vnode, _vnode);
      });
    });
  }
}
