module TrackDictionary
  TRACK_KEY_MAPPING = {
    "aero_requirement" => "ar",
    "dominant_corner_speed" => "cs",
    "surface_bumpiness" => "sb",
    "tire_degradation_rate" => "td",
    "layout_type" => "lt"
  }.freeze

  AERO_REQUIREMENT_MAPPING = {
    "high_downforce" => "hd",
    "low_drag" => "ld",
    "balanced" => "bl"
  }.freeze

  DOMINANT_CORNER_SPEED_MAPPING = {
    "low_speed_mechanical" => "ls",
    "high_speed_aerodynamic" => "hs"
  }.freeze

  SURFACE_BUMPINESS_MAPPING = {
    "smooth" => "sm",
    "bumpy_severe_curbs" => "bp"
  }.freeze

  TIRE_DEGRADATION_RATE_MAPPING = {
    "high" => "hi",
    "low" => "lo"
  }.freeze

  LAYOUT_TYPE_MAPPING = {
    "stop_and_go" => "sg",
    "flowing_sweeping" => "fs"
  }.freeze
end
