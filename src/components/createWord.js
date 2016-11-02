import m from 'mithril';

const CreateWord = {
  oninit(vnode) {
    vnode.state.inputText = m.prop('');
  },
  view(vnode) {
    const loading = vnode.attrs.loading;

    async function create() {
      const text = vnode.state.inputText().trim();
      const ch = vnode.attrs.complexActionsChannels.dbInsert;
      await ch.put(text);
      vnode.state.inputText('');
    }

    return loading
      ? m('p', 'Adding word...')
      : m('p', [
          m('input[type="text"]', {
            value: vnode.state.inputText(),
            onchange: m.withAttr('value', vnode.state.inputText)
          }),
          m('a[href="#"]', {
            onclick: create
          }, 'Add...')
        ])
  }
};

export default CreateWord;
