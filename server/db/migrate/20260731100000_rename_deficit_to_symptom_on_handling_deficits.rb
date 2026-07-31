class RenameDeficitToSymptomOnHandlingDeficits < ActiveRecord::Migration[8.1]
  def change
    rename_column :handling_deficits, :deficit, :symptom
  end
end
