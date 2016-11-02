import m from 'mithril';

import CreateWord from './createWord';

const Main = {
  view(vnode) {
    const state = vnode.attrs.appState;
    const currentWord = state.words[state.current];

    async function page(direction) {
      const ch = vnode.attrs.updateChannels.page;
      return await ch.put(direction);
    }

    return m('div', [
      m('p', `Current word: ${currentWord}`),
      m('p', [
        m('a[href="#"]', { onclick: () => page('prev') }, 'Previous'),
        m('a[href="#"]', { onclick: () => page('next') }, 'Next')
      ]),
      m(CreateWord, {
        complexActionsChannels: vnode.attrs.complexActionsChannels,
        loading: vnode.attrs.appState.loading
      }),
      m('pre', JSON.stringify(state, null, ' '))
    ]);
  }
};

export default Main;
