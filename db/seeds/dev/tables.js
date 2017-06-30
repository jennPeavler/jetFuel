exports.seed = function(knex, Promise) {
  return knex('urls').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          name: 'chicago'
        }, 'id')
        .then(folder => {
          return knex('urls').insert([
            { url: 'google.com', description: 'search engine', popularity: 1, folder_id: folder[0]},
            { url: 'pinball.com', description: 'pinball', popularity: 100, folder_id: folder[0]},
            { url: 'kinggeorge.com', description: 'george', popularity: 10, folder_id: folder[0]}
          ]
          )
        })

      ],
      [
        knex('folders').insert({
          name: 'pinball'
        }, 'id')
        .then(folder => {
          return knex('urls').insert([
            { url: 'theoatmeal.com', description: 'comics', popularity: 1, folder_id: folder[0]},
            { url: 'google.com', description: 'search', popularity: 2, folder_id: folder[0]},
            { url: 'facebook.com', description: 'people', popularity: 3, folder_id: folder[0]}
          ]
          )
        })

      ]) // end return Promise.all
    });
};
