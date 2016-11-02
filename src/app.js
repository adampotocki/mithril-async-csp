import 'babel-polyfill/dist/polyfill';
import Channel from 'async-csp';
import m from 'mithril';

import Updates from './updates';
import ComplexActions from './complexActions';

import Main from './components/main';

const loadApp = () => ({
  state: {
    words: ['first', 'second', 'third'],
    current: 0,
    loading: false
  },
  updates: {
    channels: {
      page: new Channel(),
      add: new Channel(),
      loading: new Channel()
    },
    consumers: {
      page: Updates.page,
      add: Updates.add,
      loading: Updates.loading
    }
  },
  complexActions: {
    channels: {
      dbInsert: new Channel()
    },
    consumers: {
      dbInsert: ComplexActions.dbInsert
    }
  },
  renderCh: new Channel(1)
});

async function initUpdates(app) {
  Object.keys(app.updates.consumers).map(async k => {
    const updateFn = app.updates.consumers[k];
    const ch = app.updates.channels[k];
    while (true) {
      const value = await ch.take();
      console.log(`On update channel [ ${k} ] received value [ ${JSON.stringify(value)} ]`);
      app.state = updateFn(app.state, value);
      await app.renderCh.put(app.state);
    }
  });
}

async function initComplexActions(app) {
  Object.keys(app.complexActions.consumers).map(async k => {
    const complexActionFn = app.complexActions.consumers[k];
    const ch = app.complexActions.channels[k];
    while (true) {
      const value = await ch.take();
      console.log(`On complex action channel [ ${k} ] received value [ ${JSON.stringify(value)} ]`);
      complexActionFn(app.updates.channels, value);
    }
  });
}

async function initRender(app, element) {
  app.renderCh.put(app.state);

  while (true) {
    const state = await app.renderCh.take();
    const finishRender = new Channel();

    m.render(element, m(Main, {
      appState: app.state,
      updateChannels: app.updates.channels,
      complexActionsChannels: app.complexActions.channels
    }));

    window.requestAnimationFrame(() => finishRender.put({}));
    await finishRender.take();
  }
}

const start = () => {
  const app = loadApp();
  initUpdates(app);
  initComplexActions(app);
  initRender(app, document.getElementById('appRoot'));
};

start();
