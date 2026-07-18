class Track < ActiveFile::Base
  set_root_path Rails.root.join("config")
  set_filename "tracks"

  field :name
  field :parent_circuit

  class << self
    def extension
      "json"
    end

    # TODO: active_hash caches `data` in memory per process (and reloads
    # automatically in Rails development mode); revisit if we ever need
    # explicit cache invalidation in production.
    def load_file
      JSON.parse(File.read(full_path))["tracks"]
    end
  end
end
