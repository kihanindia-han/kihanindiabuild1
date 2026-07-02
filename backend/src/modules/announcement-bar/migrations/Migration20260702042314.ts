import { Migration } from "@mikro-orm/migrations"

export class Migration20260702042314 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `CREATE TABLE IF NOT EXISTS "announcement_bar" (
        "id" TEXT NOT NULL,
        "messages" JSONB NOT NULL DEFAULT '[]'::jsonb,
        "rotation_speed" INTEGER NOT NULL DEFAULT 3500,
        "background_color" TEXT NOT NULL DEFAULT '#1C1C1C',
        "text_color" TEXT NOT NULL DEFAULT '#FAF9F6',
        "font_family" TEXT NOT NULL DEFAULT 'Jost',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT "announcement_bar_pkey" PRIMARY KEY ("id")
      );`
    )
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "announcement_bar";`)
  }
}
