class TrackSerializer
  include Alba::Serializer

  transform_keys :lower_camel
  attributes :id, :name
end
