class CreateHandlingDeficits < ActiveRecord::Migration[8.1]
  def change
    create_table :handling_deficits do |t|
      t.references :working_session, null: false, foreign_key: true
      t.string :location, null: false
      t.string :deficit, null: false

      t.timestamps
    end
  end
end
