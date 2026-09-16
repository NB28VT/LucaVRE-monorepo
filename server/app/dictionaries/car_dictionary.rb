module CarDictionary
  CAR_KEY_MAPPING = {
    "engine_layout" => "el",
    "aero_dependency" => "ad",
    "wheelbase" => "wb",
    "weight_distribution" => "wd"
  }.freeze

  ENGINE_LAYOUT_MAPPING = {
    "front_engine" => "fe",
    "mid_engine" => "me",
    "rear_engine" => "re"
  }.freeze

  AERO_DEPENDENCY_MAPPING = {
    "high" => "hi",
    "medium" => "md"
  }.freeze

  WHEELBASE_MAPPING = {
    "short" => "sh",
    "long" => "lg"
  }.freeze

  WEIGHT_DISTRIBUTION_MAPPING = {
    "rear_biased" => "rb",
    "neutral" => "nt",
    "front_biased" => "fb"
  }.freeze
end
