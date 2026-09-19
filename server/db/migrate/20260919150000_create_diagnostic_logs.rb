class CreateDiagnosticLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :diagnostic_logs do |t|
      t.references :working_session, null: false, foreign_key: true
      t.string :car_id, null: false
      t.string :track_id, null: false
      t.jsonb :recommendations, null: false, default: {}
      t.text :thought_process

      t.timestamps
    end

    create_table :diagnostic_logs_handling_deficits, id: false do |t|
      t.bigint :diagnostic_log_id, null: false
      t.bigint :handling_deficit_id, null: false
    end

    add_foreign_key :diagnostic_logs_handling_deficits, :diagnostic_logs, on_delete: :cascade
    add_foreign_key :diagnostic_logs_handling_deficits, :handling_deficits, on_delete: :cascade
    add_index :diagnostic_logs_handling_deficits,
              [:diagnostic_log_id, :handling_deficit_id],
              unique: true,
              name: "index_diagnostic_logs_handling_deficits_uniqueness"
    add_index :diagnostic_logs_handling_deficits, :handling_deficit_id
  end
end
