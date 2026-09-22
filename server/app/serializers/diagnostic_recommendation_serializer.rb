class DiagnosticRecommendationSerializer
  include Alba::Serializer

  transform_keys :lower_camel

  attribute :recommendations do |source|
    source.deep_transform_keys { |key| key.to_s.camelize(:lower) }
  end
end
