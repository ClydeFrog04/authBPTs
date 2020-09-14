import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", tableBuilder => {
        tableBuilder.uuid("id").notNullable().unique().primary();
            tableBuilder.string("username", 128).notNullable().unique().index();
            tableBuilder.string("password", 256).notNullable();
            tableBuilder.boolean("admin").defaultTo(false);

        });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("users");
}
