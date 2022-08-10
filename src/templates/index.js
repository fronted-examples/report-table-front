import Drawer from "./Drawer/index";
import Radio from "./Radio/index";
import RadioGroup from "./RadioGroup/index";

const components = [Drawer, Radio, RadioGroup];

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Drawer,
  Radio,
  RadioGroup
};
