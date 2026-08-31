module Dictionaries
  module HandlingDeficitDictionary
    HANDLING_DEFICIT_LOCATION_MAPPING = {
      "high_speed" => "hi_spd",
      "mid_speed" => "med_spd",
      "low_speed" => "lo_spd",
      "global" => "glbl"
    }.freeze

    HANDLING_DEFICIT_PHASE_MAPPING = {
        "entry" => "entry",
        "mid_corner" => "mid",
        "exit" => "exit"
    }.freeze
    
    HANDLING_DEFICIT_SYMPTOM_MAPPING = {
        "understeer" => "us",
        "oversteer" => "os"
    }.freeze
  end
end
