class CreateWorkingSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :working_sessions do |t|
      t.string :track_id, null: false
      t.string :car_id, null: false

      t.timestamps
    end
  end
end
