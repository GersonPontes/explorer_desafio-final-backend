exports.up = knex => knex.schema.createTable("dishes", table => {
  table
  .increments("id");
  table
  .text("name")
  .notNullable();
  table
  .text("description")
  .notNullable();
  table
  .text("price")
  .notNullable();
  table
  .text("image")
  .notNullable();
  table
  .enum("category", ["meal", "dessert", "drink"], { userNative:true, enumName: "categories" })
  .notNullable().default("meal");
  table
  .integer("user_id").references("id").inTable("users")
  table
  .timestamp("created_at").default(knex.fn.now());
  table
  .timestamp("updated_at").default(knex.fn.now()); 
});

exports.down = knex => knex.schema.dropTable("dishes");