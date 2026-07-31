class AddUniqueIndexToHandlingDeficitsOnWorkingSessionAndLocation < ActiveRecord::Migration[8.1]
  def change
    remove_index :handling_deficits, :working_session_id
    add_index :handling_deficits, [:working_session_id, :location], unique: true
  end
end
