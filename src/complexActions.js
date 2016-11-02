import { timeout } from 'async-csp';

//
// complex action functions
//
const ComplexActions = {
  async dbInsert(updateChannels, newWord) {
    await updateChannels.loading.put(true);
    // simulate do something costly with timeout
    await timeout(1000);

    await updateChannels.add.put(newWord);
    await updateChannels.loading.put(false);
  }
};

export default ComplexActions;
