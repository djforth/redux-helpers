import ProcessAssociations from '../../src/actions//process_associations';

import {
  spies as SpyManager
} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();

describe('processAssociations', function(){
  afterEach(()=>{
    spyManager.removeAll();
    // stubs.revertAll(); // Reverts All stubs
  });

  let proccessor;
  beforeEach(function(){
    spyManager.add(['creator', 'dispatch']);
    spyManager.addReturn('creator')('returnValue', 'creator');
    proccessor = ProcessAssociations(spyManager.get('dispatch'));
  });

  it('should set title if string passed', function(){
    let creator = spyManager.get('creator');
    let dispatch = spyManager.get('dispatch');
    let proccessed =  proccessor('foo', creator, 'pa');
    expect(creator).toHaveBeenCalledWith({title: 'foo'});
    expect(dispatch).toHaveBeenCalledWith('creator');

    expect(proccessed.pa_title).toEqual('foo');
    expect(proccessed.pa_id).toBeNull();
  });

  it('should set id if integer passed', function(){
    let creator = spyManager.get('creator');
    let proccessed =  proccessor(2, creator, 'pa');
    expect(creator).not.toHaveBeenCalled();
    expect(proccessed.pa_id).toEqual(2);
  });
});
