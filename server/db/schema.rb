# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_19_150000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "diagnostic_logs", force: :cascade do |t|
    t.string "car_id", null: false
    t.datetime "created_at", null: false
    t.jsonb "recommendations", default: {}, null: false
    t.text "thought_process"
    t.string "track_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "working_session_id", null: false
    t.index ["working_session_id"], name: "index_diagnostic_logs_on_working_session_id"
  end

  create_table "diagnostic_logs_handling_deficits", id: false, force: :cascade do |t|
    t.bigint "diagnostic_log_id", null: false
    t.bigint "handling_deficit_id", null: false
    t.index ["diagnostic_log_id", "handling_deficit_id"], name: "index_diagnostic_logs_handling_deficits_uniqueness", unique: true
    t.index ["handling_deficit_id"], name: "index_diagnostic_logs_handling_deficits_on_handling_deficit_id"
  end

  create_table "handling_deficits", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "location", null: false
    t.string "phase"
    t.string "symptom", null: false
    t.datetime "updated_at", null: false
    t.bigint "working_session_id", null: false
    t.index ["working_session_id", "location", "phase"], name: "index_handling_deficits_on_session_location_phase", unique: true
    t.index ["working_session_id", "location"], name: "index_handling_deficits_on_session_location_null_phase", unique: true, where: "(phase IS NULL)"
  end

  create_table "working_sessions", force: :cascade do |t|
    t.string "car_id", null: false
    t.datetime "created_at", null: false
    t.string "track_id", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "diagnostic_logs", "working_sessions"
  add_foreign_key "diagnostic_logs_handling_deficits", "diagnostic_logs", on_delete: :cascade
  add_foreign_key "diagnostic_logs_handling_deficits", "handling_deficits", on_delete: :cascade
  add_foreign_key "handling_deficits", "working_sessions"
end
