class HandlingDeficitSerializer
  include Alba::Serializer

  transform_keys :lower_camel
  attributes :id, :working_session_id, :location, :deficit, :created_at
end
