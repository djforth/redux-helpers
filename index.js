exports.action = {
  association: require('./lib/actions/association_helper')
  , create: require('./lib/actions/create_data')
  , destroy: require('./lib/actions/destroy_data')
  , fetch: require('./lib/actions/fetch_data')
  , generate: require('./lib/actions/generate_actions')
  , modal: require('./lib/actions/modal_helpers')
  , process_associations: require('./lib/actions/process_associations')
  , update: require('./lib/actions/update_data')
};

exports.reducers = {
  add_data: require('./lib/reducers/association_helper')
  , create_data: require('./lib/reducers/create_data')
  , create: require('./lib/reducers/create_reducer')
  , destroy_data: require('./lib/reducers/destroy_data')
  , destroy: require('./lib/reducers/destroy_reducer')
  , fetch: require('./lib/reducers/fetch_reducer')
  , get_data: require('./lib/reducers/get_data')
  , modal: require('./lib/reducers/modal_modal_reducer')
  , open_close: require('./lib/reducers/open_close')
  , set_defaults: require('./lib/reducers/set_defaults')
  , update_data: require('./lib/reducers/update_data')
  , update: require('./lib/reducers/update_reducer')
  , update_state: require('./lib/reducers/update_state')
}