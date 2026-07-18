class WorkingSessionSerializer
    include Alba::Serializer

    transform_keys :lower_camel
    attributes :id, :car_id, :track_id, :created_at

    attribute :track do |session|
      next unless session.track

      { id: session.track.id, name: session.track.name }
    end

    attribute :car do |session|
      next unless session.car

      { id: session.car.id, name: session.car.name }
    end
  end
  