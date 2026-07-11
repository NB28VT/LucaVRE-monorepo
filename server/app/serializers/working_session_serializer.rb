class WorkingSessionSerializer
    include Alba::Serializer

    transform_keys :lower_camel
    attributes :id, :car_id, :track_id, :created_at
  end
  