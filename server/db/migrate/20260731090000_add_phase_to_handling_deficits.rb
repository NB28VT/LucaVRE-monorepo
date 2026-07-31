class AddPhaseToHandlingDeficits < ActiveRecord::Migration[8.1]
  def change
    add_column :handling_deficits, :phase, :string

    remove_index :handling_deficits, [:working_session_id, :location]

    add_index :handling_deficits, [:working_session_id, :location, :phase],
              unique: true,
              name: "index_handling_deficits_on_session_location_phase"
    add_index :handling_deficits, [:working_session_id, :location],
              unique: true,
              where: "phase IS NULL",
              name: "index_handling_deficits_on_session_location_null_phase"
  end
end
