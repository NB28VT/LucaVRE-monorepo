class CarSerializer
  include Alba::Serializer

  transform_keys :lower_camel
  attributes :id, :name
end
