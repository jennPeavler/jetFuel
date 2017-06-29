exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', function(table) {
      table.increments('id').primary()
      table.string('name')
      table.timestamps(true, true)
    }),

    knex.schema.createTable('urls', function(table) {
      table.increments('id').primary()
      table.string('url')
      table.string('description')
      table.integer('popularity').unsigned().defaultTo(1)
      table.integer('folder_id').unsigned()
      table.foreign('folder_id')
        .references('folders.id')
      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('urls'),
    knex.schema.dropTable('folders')
  ]);
};
