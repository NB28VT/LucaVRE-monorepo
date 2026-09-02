module Dictionaries
    module TrackDictionary
      TRACK_KEY_MAPPING = {
        "downforce_requirement"  => "dr",
        "surface_roughness"      => "sr",
        "curb_intensity"         => "ci",
        "primary_characteristic" => "pc"
      }.freeze
  
      DOWNFORCE_REQUIREMENT_MAPPING = {
        "extreme_low" => "xl",
        "ultra_low"   => "ul",
        "low"         => "lw",
        "low_medium"  => "lm",
        "medium"      => "md",
        "medium_high" => "mh",
        "high"        => "hg"
      }.freeze
  
      SURFACE_ROUGHNESS_MAPPING = {
        "smooth"        => "sm",
        "medium"        => "me",
        "bumpy"         => "bp",
        "extreme_bumpy" => "xb"
      }.freeze
  
      CURB_INTENSITY_MAPPING = {
        "low"    => "lo",
        "medium" => "me",
        "high"   => "hi",
        "severe" => "sv"
      }.freeze
  
      PRIMARY_CHARACTERISTIC_MAPPING = {
        "elevation_changes"               => "elc",
        "blind_crests"                    => "blc",
        "trail_braking_zones"             => "tbz",
        "heavy_traction_demands"          => "htd",
        "heavy_braking_zones"             => "hbz",
        "traction_limited"                => "trl",
        "high_tire_degradation"           => "htd", # Note: can map to 'htg' if 'htd' clashes
        "slow_technical_sectors"          => "sts",
        "top_speed_importance"            => "tsi",
        "flat_out_sections"               => "fos",
        "tight_radii_corners"             => "trc",
        "long_high_speed_corners"         => "lhc",
        "tire_loading_front_left"         => "tfl",
        "aerodynamic_efficiency_test"     => "aet",
        "short_corners"                   => "shc",
        "rapid_direction_changes"         => "rdc",
        "large_sausage_curbs"             => "lsc",
        "ultra_long_straightaway"         => "uls",
        "tight_technical_final_sector"    => "tfs",
        "high_average_speed"              => "has",
        "aggressive_curb_riding"          => "acr",
        "chicanes_dominant"               => "chd",
        "cambered_corners"                => "cbc",
        "extreme_top_speed_importance"    => "xts",
        "high_speed_stability"            => "hss",
        "heavy_braking_from_top_speed"    => "hbs",
        "continuous_high_speed_sweepers"  => "css",
        "aerodynamic_understeer_zones"    => "auz",
        "flow_state_corners"              => "fsc",
        "concrete_surface_changes"        => "csc",
        "severe_bump_instability"         => "sbi",
        "ultra_high_speed_sweepers"       => "uhs",
        "aerodynamic_stability_test"      => "ast",
        "compression_zones_compression"   => "czc",
        "high_banked_oval_sections"       => "hbo",
        "heavy_braking_into_infield"      => "hbi",
        "extreme_elevation_changes"       => "eec",
        "low_grip_surface"                => "lgs"
      }.freeze
    end
  end