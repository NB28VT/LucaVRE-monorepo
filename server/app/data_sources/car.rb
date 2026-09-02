class Car < ActiveFile::Base
  set_root_path Rails.root.join("db/data")
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

  def to_profile_xml
    PromptSerializers::CarXmlSerializer.new(self).to_xml
  end
end
