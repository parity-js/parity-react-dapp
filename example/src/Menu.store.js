import { action, observable } from 'mobx';

export default class MenuStore {
  @observable active = 'home';

  @action setActive (tab) {
    this.active = tab;
  }
}
