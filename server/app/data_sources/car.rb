class Car < ActiveFile::Base
  set_root_path Rails.root.join("config")
  set_filename "cars"

  field :name

  class << self
    def extension
      "json"
    end

    def load_file
      JSON.parse(File.read(full_path))["cars"]
    end
  end
end
